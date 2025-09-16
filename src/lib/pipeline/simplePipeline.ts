import axios from 'axios';
import { generateAIContent } from '@/lib/genai';
import connectToDatabase from '@/lib/database/connection';
import { MongoClient } from 'mongodb';

interface SimpleArticle {
  title: string;
  coverImage: string;
  publisherName: string;
  publisherLogo?: string;
  authorName: string;
  datePosted: Date;
  quickSummary: string;
  detailedSummary: string;
  whyItMatters: string;
  sourceUrl: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning';
  createdAt: Date;
  updatedAt: Date;
}

export class SimplePipeline {
  private publisherLogos: Record<string, string> = {
    'techcrunch.com': 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png',
    'wired.com': 'https://www.wired.com/verso/static/wired/assets/favicon.ico',
    'theverge.com': 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395359/android-chrome-192x192.0.png',
    'arstechnica.com': 'https://cdn.arstechnica.net/wp-content/uploads/2016/10/cropped-ars-logo-512.png',
    'venturebeat.com': 'https://venturebeat.com/wp-content/themes/vb-news/img/favicon.ico'
  };

  async fetchTechArticles(count: number = 10): Promise<any[]> {
    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY;
      if (!NEWS_API_KEY) {
        throw new Error('NEWS_API_KEY not configured');
      }

      console.log(`🔍 Fetching ${count} tech articles...`);

      // Fetch from multiple tech keywords  
      const keywords = ['software development', 'cybersecurity', 'blockchain technology', 'cloud computing', 'data science'];
      const allArticles: any[] = [];

      for (const keyword of keywords) {
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: keyword,
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: Math.ceil(count / keywords.length),
              from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              apiKey: NEWS_API_KEY
            }
          });

          if (response.data.status === 'ok') {
            allArticles.push(...response.data.articles);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error fetching ${keyword}:`, error);
        }
      }

      // Filter and clean articles
      const filteredArticles = allArticles
        .filter(article => 
          article.title && 
          article.url && 
          article.publishedAt &&
          !article.title.includes('[Removed]') &&
          article.title.length >= 10
        )
        .slice(0, count);

      console.log(`✅ Fetched ${filteredArticles.length} articles`);
      return filteredArticles;

    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  async processArticleWithAI(article: any): Promise<SimpleArticle> {
    console.log(`🤖 Processing: ${article.title.substring(0, 50)}...`);

    try {
      // Generate compact AI content
      const quickSummary = await this.generateQuickSummary(article);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting

      const detailedSummary = await this.generateDetailedSummary(article);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting

      const whyItMatters = await this.generateWhyItMatters(article);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting

      // Determine category
      const category = this.determineCategory(article.title, article.description || '');

      // Get publisher logo
      const publisherLogo = this.getPublisherLogo(article.url);

      // Ensure valid image URL
      const coverImage = this.getValidImageUrl(article.urlToImage);

      const processedArticle: SimpleArticle = {
        title: article.title.substring(0, 200), // Ensure title fits
        coverImage,
        publisherName: (article.source?.name || 'Tech News').substring(0, 100),
        publisherLogo,
        authorName: (article.author || 'Editorial Team').substring(0, 100),
        datePosted: new Date(article.publishedAt),
        quickSummary: quickSummary.substring(0, 500),
        detailedSummary: detailedSummary.substring(0, 2000),
        whyItMatters: whyItMatters.substring(0, 1000),
        sourceUrl: article.url,
        category,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`✅ Processed: ${processedArticle.title.substring(0, 50)}...`);
      return processedArticle;

    } catch (error) {
      console.error(`❌ Error processing article: ${article.title}`, error);
      throw error;
    }
  }

  private async generateQuickSummary(article: any): Promise<string> {
    const prompt = `Write a single, clear sentence (under 400 characters) summarizing this tech news:

Title: ${article.title}
Description: ${article.description || ''}

Make it engaging and focus on the key innovation or development.`;

    const result = await generateAIContent(prompt);
    return result.trim();
  }

  private async generateDetailedSummary(article: any): Promise<string> {
    const prompt = `Write exactly 2 paragraphs (under 1800 characters total) explaining this tech news in simple language:

Title: ${article.title}
Description: ${article.description || ''}
Content: ${(article.content || '').substring(0, 500)}

Focus on what happened, why it's important, and what it means for the tech industry.`;

    const result = await generateAIContent(prompt);
    return result.trim();
  }

  private async generateWhyItMatters(article: any): Promise<string> {
    const prompt = `Write 1 paragraph (under 800 characters) explaining why this tech news matters for AI enthusiasts and learners:

Title: ${article.title}
Description: ${article.description || ''}

Focus on learning opportunities, industry implications, and connections to AI/tech trends.`;

    const result = await generateAIContent(prompt);
    return result.trim();
  }

  private determineCategory(title: string, description: string): SimpleArticle['category'] {
    const content = (title + ' ' + description).toLowerCase();
    
    if (content.includes('ai') || content.includes('artificial intelligence') || content.includes('machine learning')) {
      return content.includes('machine learning') ? 'Machine Learning' : 'AI';
    }
    if (content.includes('startup') || content.includes('entrepreneur')) return 'Startups';
    if (content.includes('funding') || content.includes('investment') || content.includes('venture')) return 'Funding';
    
    return 'Technology';
  }

  private getPublisherLogo(url: string): string | undefined {
    try {
      const domain = new URL(url).hostname.toLowerCase().replace('www.', '');
      return this.publisherLogos[domain];
    } catch {
      return undefined;
    }
  }

  private getValidImageUrl(imageUrl: string | null): string {
    const defaultImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176.jpg';
    
    if (!imageUrl) return defaultImage;
    
    // Check if it's a valid image URL
    if (imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return imageUrl;
    }
    
    // If it's not a direct image, try to convert it
    if (imageUrl.includes('unsplash.com')) {
      return imageUrl.includes('?') ? `${imageUrl}&fm=jpg` : `${imageUrl}?fm=jpg`;
    }
    
    return defaultImage;
  }

  async saveToDatabase(articles: SimpleArticle[]): Promise<{ saved: number; errors: number }> {
    console.log(`💾 Saving ${articles.length} articles to database...`);
    
    try {
      const client = new MongoClient(process.env.MONGODB_URI!);
      await client.connect();
      
      const db = client.db();
      const collection = db.collection('articles');
      
      // Check existing count
      const existingCount = await collection.countDocuments();
      console.log(`📊 Found ${existingCount} existing articles`);
      
      let saved = 0;
      let errors = 0;
      
      // Insert articles one by one to handle validation issues
      for (const article of articles) {
        try {
          // Check if article already exists by URL
          const existing = await collection.findOne({ sourceUrl: article.sourceUrl });
          if (existing) {
            console.log(`⚠️ Skipping duplicate: ${article.title.substring(0, 50)}...`);
            continue;
          }
          
          await collection.insertOne(article);
          saved++;
          console.log(`✅ Saved: ${article.title.substring(0, 50)}...`);
        } catch (error) {
          console.error(`❌ Error saving: ${article.title.substring(0, 50)}...`, error);
          errors++;
        }
      }
      
      await client.close();
      console.log(`💾 Database update complete: ${saved} saved, ${errors} errors`);
      
      return { saved, errors };
      
    } catch (error) {
      console.error('❌ Database error:', error);
      return { saved: 0, errors: articles.length };
    }
  }

  async execute(targetCount: number = 10): Promise<{
    success: boolean;
    articlesProcessed: number;
    articlesSaved: number;
    errors: number;
  }> {
    console.log('🚀 EXECUTING SIMPLE PIPELINE');
    console.log('============================');
    
    try {
      // Step 1: Fetch articles
      const rawArticles = await this.fetchTechArticles(targetCount);
      if (rawArticles.length === 0) {
        throw new Error('No articles fetched');
      }
      
      // Step 2: Process with AI (limit to avoid quota issues)
      const articlesToProcess = rawArticles.slice(0, Math.min(targetCount, 5)); // Limit to 5 to avoid quota
      const processedArticles: SimpleArticle[] = [];
      
      for (const article of articlesToProcess) {
        try {
          const processed = await this.processArticleWithAI(article);
          processedArticles.push(processed);
        } catch (error) {
          console.error(`Skipping article due to error:`, error);
        }
      }
      
      if (processedArticles.length === 0) {
        throw new Error('No articles processed successfully');
      }
      
      // Step 3: Save to database
      const { saved, errors } = await this.saveToDatabase(processedArticles);
      
      console.log('🎉 PIPELINE COMPLETE!');
      console.log(`📊 Results: ${saved} saved, ${errors} errors`);
      
      return {
        success: saved > 0,
        articlesProcessed: processedArticles.length,
        articlesSaved: saved,
        errors
      };
      
    } catch (error) {
      console.error('❌ Pipeline failed:', error);
      return {
        success: false,
        articlesProcessed: 0,
        articlesSaved: 0,
        errors: 1
      };
    }
  }
}
