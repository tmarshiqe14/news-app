import connectToDatabase from '@/lib/database/connection';
import Article from '@/lib/models/Article';
import { ProcessedArticle } from './newsProcessor';

export class DatabaseUpdater {
  /**
   * Clears existing mock data from the articles collection
   */
  async clearMockData(): Promise<void> {
    try {
      await connectToDatabase();
      
      const deleteResult = await Article.deleteMany({});
      console.log(`🗑️ Cleared ${deleteResult.deletedCount} existing articles from database`);
      
    } catch (error) {
      console.error('❌ Error clearing mock data:', error);
      throw error;
    }
  }

  /**
   * Checks if an article already exists by source URL
   */
  async articleExists(sourceUrl: string): Promise<boolean> {
    try {
      const existing = await Article.findOne({ sourceUrl });
      return !!existing;
    } catch (error) {
      console.error('❌ Error checking article existence:', error);
      return false;
    }
  }

  /**
   * Saves a single processed article to the database
   */
  async saveArticle(article: ProcessedArticle): Promise<boolean> {
    try {
      // Check if article already exists
      const exists = await this.articleExists(article.sourceUrl);
      if (exists) {
        console.log(`⚠️ Article already exists, skipping: ${article.title.substring(0, 50)}...`);
        return false;
      }

      // Create new article
      const newArticle = new Article(article);
      await newArticle.save();
      
      console.log(`✅ Saved article: ${article.title.substring(0, 50)}...`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error saving article: ${article.title}`, error);
      return false;
    }
  }

  /**
   * Saves multiple articles to the database
   */
  async saveArticles(articles: ProcessedArticle[]): Promise<{
    saved: number;
    skipped: number;
    errors: number;
  }> {
    console.log(`💾 Saving ${articles.length} articles to database...`);
    
    let saved = 0;
    let skipped = 0;
    let errors = 0;

    await connectToDatabase();

    for (const article of articles) {
      try {
        const wasSaved = await this.saveArticle(article);
        if (wasSaved) {
          saved++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error saving article: ${article.title}`, error);
        errors++;
      }
    }

    console.log(`📊 Database update complete: ${saved} saved, ${skipped} skipped, ${errors} errors`);
    
    return { saved, skipped, errors };
  }

  /**
   * Replaces all mock data with new articles
   */
  async replaceWithRealData(articles: ProcessedArticle[]): Promise<{
    cleared: number;
    saved: number;
    errors: number;
  }> {
    console.log('🔄 Replacing mock data with real articles...');
    
    try {
      // Clear existing data
      await connectToDatabase();
      const deleteResult = await Article.deleteMany({});
      const cleared = deleteResult.deletedCount;
      
      console.log(`🗑️ Cleared ${cleared} existing articles`);

      // Save new articles
      let saved = 0;
      let errors = 0;

      for (const article of articles) {
        try {
          const newArticle = new Article(article);
          await newArticle.save();
          saved++;
          console.log(`✅ Saved: ${article.title.substring(0, 50)}...`);
        } catch (error) {
          console.error(`❌ Error saving: ${article.title}`, error);
          errors++;
        }
      }

      console.log(`🎉 Database replacement complete!`);
      console.log(`📊 Results: ${cleared} cleared, ${saved} saved, ${errors} errors`);

      return { cleared, saved, errors };

    } catch (error) {
      console.error('❌ Error in database replacement:', error);
      throw error;
    }
  }

  /**
   * Verifies the database contains the expected number of articles
   */
  async verifyArticleCount(expectedCount: number): Promise<{
    actualCount: number;
    isCorrect: boolean;
  }> {
    try {
      await connectToDatabase();
      const actualCount = await Article.countDocuments();
      const isCorrect = actualCount === expectedCount;

      console.log(`📊 Database verification: ${actualCount}/${expectedCount} articles ${isCorrect ? '✅' : '❌'}`);

      return { actualCount, isCorrect };

    } catch (error) {
      console.error('❌ Error verifying article count:', error);
      return { actualCount: 0, isCorrect: false };
    }
  }

  /**
   * Gets a sample of articles for verification
   */
  async getSampleArticles(count: number = 3): Promise<any[]> {
    try {
      await connectToDatabase();
      const articles = await Article.find()
        .select('title publisherName category sourceUrl createdAt')
        .sort({ createdAt: -1 })
        .limit(count);

      return articles;

    } catch (error) {
      console.error('❌ Error getting sample articles:', error);
      return [];
    }
  }
}
