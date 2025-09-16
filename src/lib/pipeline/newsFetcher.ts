import axios from 'axios';

// Define NewsAPI types since we're using direct API calls
export interface NewsAPIArticle {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
}

export interface FetchConfig {
  sources: string[];
  categories: string[];
  excludeKeywords: string[];
  pageSize: number;
}

export class NewsFetcher {
  private config: FetchConfig = {
    sources: [
      'techcrunch',
      'wired',
      'the-verge',
      'ars-technica',
      'venturebeat',
      'engadget',
      'techradar',
      'reuters',
      'bloomberg'
    ],
    categories: ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'],
    excludeKeywords: ['politics', 'war', 'military', 'defense', 'election', 'government'],
    pageSize: 50 // Fetch more to filter down to 10 quality articles
  };

  /**
   * Fetches articles from premium tech sources
   */
  async fetchFromSources(): Promise<NewsAPIArticle[]> {
    console.log('📰 Fetching articles from premium tech sources...');
    
    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY;
      if (!NEWS_API_KEY) {
        throw new Error('NEWS_API_KEY environment variable is not set');
      }

      // Fetch from specific sources using direct API call
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          sources: this.config.sources.join(','),
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: this.config.pageSize,
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          apiKey: NEWS_API_KEY
        }
      });

      if (response.data.status !== 'ok') {
        throw new Error(`News API error: ${response.data.status}`);
      }

      console.log(`✅ Fetched ${response.data.articles.length} articles from sources`);
      return response.data.articles || [];

    } catch (error) {
      console.error('❌ Error fetching from sources:', error);
      return [];
    }
  }

  /**
   * Fetches articles using keyword search for tech topics
   */
  async fetchByKeywords(): Promise<NewsAPIArticle[]> {
    console.log('🔍 Fetching articles by tech keywords...');
    
    const keywords = [
      'artificial intelligence',
      'machine learning',
      'startup funding',
      'tech startup',
      'AI breakthrough',
      'technology innovation',
      'venture capital',
      'series A funding',
      'tech IPO'
    ];

    const allArticles: NewsAPIArticle[] = [];

    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY;
      if (!NEWS_API_KEY) {
        throw new Error('NEWS_API_KEY environment variable is not set');
      }

      // Fetch articles for each keyword
      for (const keyword of keywords.slice(0, 3)) { // Limit to avoid rate limits
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: keyword,
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 20,
              from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              apiKey: NEWS_API_KEY
            }
          });

          if (response.data.status === 'ok' && response.data.articles) {
            allArticles.push(...response.data.articles);
          }

          // Rate limit delay
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`❌ Error fetching keyword "${keyword}":`, error);
          continue;
        }
      }

      console.log(`✅ Fetched ${allArticles.length} articles by keywords`);
      return allArticles;

    } catch (error) {
      console.error('❌ Error in keyword search:', error);
      return [];
    }
  }

  /**
   * Filters articles to remove duplicates and unwanted content
   */
  private filterArticles(articles: NewsAPIArticle[]): NewsAPIArticle[] {
    console.log(`🔍 Filtering ${articles.length} articles...`);

    // Remove duplicates by URL
    const uniqueArticles = articles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    // Filter out unwanted content
    const filteredArticles = uniqueArticles.filter(article => {
      // Skip articles without required fields
      if (!article.title || !article.url || !article.publishedAt) {
        return false;
      }

      // Skip removed content
      if (article.title.includes('[Removed]') || 
          article.description?.includes('[Removed]') ||
          article.content?.includes('[Removed]')) {
        return false;
      }

      // Check for excluded keywords
      const content = (article.title + ' ' + (article.description || '')).toLowerCase();
      const hasExcludedKeyword = this.config.excludeKeywords.some(keyword => 
        content.includes(keyword)
      );

      if (hasExcludedKeyword) {
        return false;
      }

      // Must be from tech sources or contain tech keywords
      const isTechContent = content.includes('technology') ||
                           content.includes('tech') ||
                           content.includes('ai') ||
                           content.includes('artificial intelligence') ||
                           content.includes('machine learning') ||
                           content.includes('startup') ||
                           content.includes('funding') ||
                           content.includes('venture') ||
                           content.includes('innovation') ||
                           content.includes('software') ||
                           content.includes('digital') ||
                           content.includes('app') ||
                           content.includes('platform');

      return isTechContent;
    });

    // Sort by publication date (newest first)
    filteredArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    console.log(`✅ Filtered to ${filteredArticles.length} quality tech articles`);
    return filteredArticles;
  }

  /**
   * Fetches and filters articles to get exactly the requested number
   */
  async fetchArticles(targetCount: number = 10): Promise<NewsAPIArticle[]> {
    console.log(`🎯 Fetching ${targetCount} high-quality tech articles...`);

    try {
      // Fetch from multiple sources
      const [sourceArticles, keywordArticles] = await Promise.all([
        this.fetchFromSources(),
        this.fetchByKeywords()
      ]);

      // Combine and filter articles
      const allArticles = [...sourceArticles, ...keywordArticles];
      const filteredArticles = this.filterArticles(allArticles);

      // Return the top articles up to the target count
      const finalArticles = filteredArticles.slice(0, targetCount);

      console.log(`🎉 Successfully fetched ${finalArticles.length} articles for processing`);
      
      // Log article sources for verification
      finalArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title.substring(0, 60)}... (${article.source.name})`);
      });

      return finalArticles;

    } catch (error) {
      console.error('❌ Error in fetchArticles:', error);
      throw error;
    }
  }
}
