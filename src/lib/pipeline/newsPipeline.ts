import { NewsFetcher } from './newsFetcher';
import { NewsProcessor } from './newsProcessor';
import { DatabaseUpdater } from './databaseUpdater';

export interface PipelineResult {
  success: boolean;
  articlesProcessed: number;
  articlesSaved: number;
  errors: string[];
  executionTime: number;
}

export class NewsPipeline {
  private fetcher: NewsFetcher;
  private processor: NewsProcessor;
  private databaseUpdater: DatabaseUpdater;

  constructor() {
    this.fetcher = new NewsFetcher();
    this.processor = new NewsProcessor();
    this.databaseUpdater = new DatabaseUpdater();
  }

  /**
   * Executes the complete news pipeline
   */
  async execute(targetArticleCount: number = 10): Promise<PipelineResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    
    console.log('🚀 STARTING NEWS PIPELINE EXECUTION');
    console.log('==================================');
    console.log(`🎯 Target: ${targetArticleCount} articles`);
    console.log(`📅 Started: ${new Date().toISOString()}`);
    console.log('');

    try {
      // Step 1: Fetch articles from News API
      console.log('📰 STEP 1: Fetching articles from premium tech sources...');
      const rawArticles = await this.fetcher.fetchArticles(targetArticleCount * 2); // Fetch more to ensure quality
      
      if (rawArticles.length === 0) {
        throw new Error('No articles fetched from News API');
      }
      
      console.log(`✅ Fetched ${rawArticles.length} raw articles`);
      console.log('');

      // Step 2: Process articles with AI
      console.log('🤖 STEP 2: Processing articles with AI...');
      const processedArticles = await this.processor.processArticles(rawArticles);
      
      if (processedArticles.length === 0) {
        throw new Error('No articles successfully processed');
      }

      // Take exactly the target number of articles
      const finalArticles = processedArticles.slice(0, targetArticleCount);
      console.log(`✅ Processed ${finalArticles.length} articles with AI content`);
      console.log('');

      // Step 3: Update database
      console.log('💾 STEP 3: Updating database...');
      const dbResult = await this.databaseUpdater.replaceWithRealData(finalArticles);
      
      console.log(`✅ Database updated: ${dbResult.saved} articles saved`);
      console.log('');

      // Step 4: Verify results
      console.log('🔍 STEP 4: Verifying results...');
      const verification = await this.databaseUpdater.verifyArticleCount(targetArticleCount);
      
      if (!verification.isCorrect) {
        errors.push(`Expected ${targetArticleCount} articles, but found ${verification.actualCount}`);
      }

      // Get sample articles for verification
      const sampleArticles = await this.databaseUpdater.getSampleArticles(3);
      
      console.log('📊 SAMPLE ARTICLES IN DATABASE:');
      sampleArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title.substring(0, 60)}...`);
        console.log(`   Publisher: ${article.publisherName}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Created: ${article.createdAt.toISOString().split('T')[0]}`);
        console.log('');
      });

      const executionTime = Date.now() - startTime;
      
      console.log('🎉 PIPELINE EXECUTION COMPLETE!');
      console.log('==============================');
      console.log(`✅ Articles processed: ${finalArticles.length}`);
      console.log(`✅ Articles saved: ${dbResult.saved}`);
      console.log(`✅ Database count: ${verification.actualCount}`);
      console.log(`⏱️ Execution time: ${Math.round(executionTime / 1000)}s`);
      console.log(`🎯 Success: ${errors.length === 0 ? 'YES' : 'NO'}`);
      
      if (errors.length > 0) {
        console.log('⚠️ Errors encountered:');
        errors.forEach(error => console.log(`   - ${error}`));
      }

      return {
        success: errors.length === 0,
        articlesProcessed: finalArticles.length,
        articlesSaved: dbResult.saved,
        errors,
        executionTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      
      console.error('❌ PIPELINE EXECUTION FAILED!');
      console.error('=============================');
      console.error(`Error: ${errorMessage}`);
      
      return {
        success: false,
        articlesProcessed: 0,
        articlesSaved: 0,
        errors,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Executes a quick test of the pipeline with fewer articles
   */
  async executeTest(): Promise<PipelineResult> {
    console.log('🧪 EXECUTING PIPELINE TEST (3 articles)');
    console.log('=======================================');
    
    return await this.execute(3);
  }

  /**
   * Gets current database status
   */
  async getDatabaseStatus(): Promise<{
    articleCount: number;
    sampleArticles: any[];
  }> {
    try {
      const verification = await this.databaseUpdater.verifyArticleCount(0); // Just get count
      const sampleArticles = await this.databaseUpdater.getSampleArticles(5);
      
      return {
        articleCount: verification.actualCount,
        sampleArticles
      };
    } catch (error) {
      console.error('❌ Error getting database status:', error);
      return {
        articleCount: 0,
        sampleArticles: []
      };
    }
  }
}
