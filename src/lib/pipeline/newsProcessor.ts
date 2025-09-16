import { generateAIContent } from '@/lib/genai';
import { NewsAPIArticle } from './newsFetcher';

export interface ProcessedArticle {
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

export class NewsProcessor {
  private publisherLogos: Record<string, string> = {
    'techcrunch.com': 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png',
    'wired.com': 'https://www.wired.com/verso/static/wired/assets/favicon.ico',
    'theverge.com': 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395359/android-chrome-192x192.0.png',
    'arstechnica.com': 'https://cdn.arstechnica.net/wp-content/uploads/2016/10/cropped-ars-logo-512.png',
    'venturebeat.com': 'https://venturebeat.com/wp-content/themes/vb-news/img/favicon.ico',
    'reuters.com': 'https://www.reuters.com/pf/resources/icons/reuters-favicon-32x32.png',
    'bloomberg.com': 'https://assets.bwbx.io/s3/javelin/public/javelin/images/favicon-black-63fe5249d3.png',
    'engadget.com': 'https://s.blogcdn.com/www.engadget.com/media/favicon.ico',
    'techradar.com': 'https://vanilla.futurecdn.net/techradar/common/favicon.ico',
    'zdnet.com': 'https://www.zdnet.com/a/fly/bundles/zdnetcss/img/logos/logo-zdnet.svg'
  };

  /**
   * Determines the category based on article content
   */
  private determineCategory(title: string, description: string): ProcessedArticle['category'] {
    const content = (title + ' ' + (description || '')).toLowerCase();
    
    if (content.includes('artificial intelligence') || 
        content.includes(' ai ') || 
        content.includes('machine learning') || 
        content.includes('neural network') || 
        content.includes('deep learning') ||
        content.includes('chatgpt') ||
        content.includes('openai') ||
        content.includes('anthropic')) {
      return content.includes('machine learning') ? 'Machine Learning' : 'AI';
    }
    
    if (content.includes('startup') || 
        content.includes('founder') || 
        content.includes('entrepreneur') ||
        content.includes('y combinator') ||
        content.includes('accelerator')) {
      return 'Startups';
    }
    
    if (content.includes('funding') || 
        content.includes('investment') || 
        content.includes('venture capital') ||
        content.includes('series a') ||
        content.includes('series b') ||
        content.includes('ipo') ||
        content.includes('valuation')) {
      return 'Funding';
    }
    
    return 'Technology';
  }

  /**
   * Gets publisher logo URL based on source URL
   */
  private getPublisherLogo(sourceUrl: string): string | undefined {
    try {
      const domain = new URL(sourceUrl).hostname.toLowerCase();
      const cleanDomain = domain.replace('www.', '');
      return this.publisherLogos[cleanDomain];
    } catch {
      return undefined;
    }
  }

  /**
   * Generates AI content for an article
   */
  private async generateAIContent(article: NewsAPIArticle): Promise<{
    quickSummary: string;
    detailedSummary: string;
    whyItMatters: string;
  }> {
    const content = `${article.title}\n\n${article.description || ''}\n\n${article.content || ''}`;
    
    // Generate quick summary
    const quickSummaryPrompt = `
    Create a single, concise sentence (50-450 characters) that summarizes this tech article:
    
    ${content.substring(0, 1000)}
    
    Requirements:
    - One clear, engaging sentence
    - Focus on the main innovation or development
    - 50-450 characters total
    - No quotes or special formatting
    `;
    
    const quickSummary = await generateAIContent(quickSummaryPrompt);
    
    // Generate detailed summary
    const detailedSummaryPrompt = `
    Write exactly two paragraphs in simple language (maximum 1800 characters total) summarizing this tech article:
    
    ${content.substring(0, 1500)}
    
    Requirements:
    - Exactly 2 paragraphs
    - Simple, clear language
    - Maximum 1800 characters total
    - Focus on key technical details and implications
    - No jargon or complex terms
    `;
    
    const detailedSummary = await generateAIContent(detailedSummaryPrompt);
    
    // Generate why it matters
    const whyItMattersPrompt = `
    Write a single paragraph (maximum 900 characters) explaining why this tech development matters specifically for AI enthusiasts and learners:
    
    ${content.substring(0, 1000)}
    
    Requirements:
    - Single paragraph
    - Maximum 900 characters
    - Targeted at AI enthusiasts and learners
    - Explain practical implications and learning opportunities
    - Connect to broader AI/tech trends
    `;
    
    const whyItMatters = await generateAIContent(whyItMattersPrompt);
    
    return {
      quickSummary: quickSummary.trim().substring(0, 500), // Ensure max 500 chars
      detailedSummary: detailedSummary.trim().substring(0, 2000), // Ensure max 2000 chars
      whyItMatters: whyItMatters.trim().substring(0, 1000) // Ensure max 1000 chars
    };
  }

  /**
   * Processes a single news article from the API
   */
  async processArticle(article: NewsAPIArticle): Promise<ProcessedArticle | null> {
    try {
      // Skip articles without required fields
      if (!article.title || !article.url || !article.publishedAt) {
        console.log(`⚠️ Skipping article: Missing required fields`);
        return null;
      }

      // Skip articles with removed content
      if (article.title.includes('[Removed]') || 
          article.description?.includes('[Removed]') ||
          article.content?.includes('[Removed]')) {
        console.log(`⚠️ Skipping removed article: ${article.title}`);
        return null;
      }

      // Skip non-tech content
      const content = (article.title + ' ' + (article.description || '')).toLowerCase();
      if (content.includes('politic') || 
          content.includes('war') || 
          content.includes('military') || 
          content.includes('defense') ||
          content.includes('election')) {
        console.log(`⚠️ Skipping non-tech article: ${article.title}`);
        return null;
      }

      console.log(`🔄 Processing article: ${article.title.substring(0, 50)}...`);

      // Generate AI content
      const aiContent = await this.generateAIContent(article);

      // Determine category
      const category = this.determineCategory(article.title, article.description || '');

      // Get publisher logo
      const publisherLogo = this.getPublisherLogo(article.url);

      // Ensure valid cover image URL
      let coverImage = article.urlToImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop';
      
      // Validate image URL format
      if (!coverImage.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)) {
        // If not a direct image URL, use a default tech image
        coverImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&fm=jpg';
      }

      // Process the article
      const processedArticle: ProcessedArticle = {
        title: article.title,
        coverImage,
        publisherName: article.source.name || 'Tech News',
        publisherLogo,
        authorName: article.author || 'Editorial Team',
        datePosted: new Date(article.publishedAt),
        quickSummary: aiContent.quickSummary,
        detailedSummary: aiContent.detailedSummary,
        whyItMatters: aiContent.whyItMatters,
        sourceUrl: article.url,
        category,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`✅ Processed article: ${processedArticle.title.substring(0, 50)}...`);
      return processedArticle;

    } catch (error) {
      console.error(`❌ Error processing article: ${article.title}`, error);
      return null;
    }
  }

  /**
   * Processes multiple articles from News API response
   */
  async processArticles(articles: NewsAPIArticle[]): Promise<ProcessedArticle[]> {
    console.log(`🔄 Processing ${articles.length} articles...`);
    
    const processedArticles: ProcessedArticle[] = [];
    
    for (const article of articles) {
      try {
        const processed = await this.processArticle(article);
        if (processed) {
          processedArticles.push(processed);
        }
        
        // Add delay to respect API rate limits (longer delay for AI API)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`❌ Error processing article: ${article.title}`, error);
        continue;
      }
    }
    
    console.log(`✅ Successfully processed ${processedArticles.length} articles`);
    return processedArticles;
  }
}
