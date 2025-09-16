import { NextRequest, NextResponse } from 'next/server';
import { NewsFetcher } from '@/lib/pipeline/newsFetcher';
import { NewsProcessor } from '@/lib/pipeline/newsProcessor';
import { updateRealArticles } from '@/data/realNews';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 STARTING LOCAL PIPELINE EXECUTION');
    console.log('====================================');
    
    const body = await request.json();
    const targetCount = body.targetCount || 10;
    
    const startTime = Date.now();
    
    // Step 1: Fetch articles from News API
    console.log('📰 Fetching articles from News API...');
    const fetcher = new NewsFetcher();
    const rawArticles = await fetcher.fetchArticles(targetCount);
    
    if (rawArticles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No articles fetched from News API',
        data: {
          articlesProcessed: 0,
          articlesSaved: 0,
          executionTimeSeconds: (Date.now() - startTime) / 1000
        }
      });
    }
    
    console.log(`✅ Fetched ${rawArticles.length} raw articles`);
    
    // Step 2: Process articles with AI
    console.log('🤖 Processing articles with AI...');
    const processor = new NewsProcessor();
    const processedArticles = [];
    
    for (let i = 0; i < rawArticles.length; i++) {
      try {
        console.log(`Processing article ${i + 1}/${rawArticles.length}: ${rawArticles[i].title?.substring(0, 50)}...`);
        const processed = await processor.processArticle(rawArticles[i]);
        
        // Transform to the expected format
        const article = {
          id: (i + 1).toString(),
          title: processed.title,
          excerpt: processed.quickSummary,
          content: processed.detailedSummary,
          imageUrl: processed.coverImage || 'https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=AI+News',
          publisherName: processed.publisherName,
          publisherLogo: processed.publisherLogo || 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=' + processed.publisherName.charAt(0),
          authorName: processed.authorName || 'AI News Team',
          publishedAt: processed.datePosted || new Date().toISOString(),
          category: processed.category,
          sourceUrl: processed.sourceUrl,
          whyItMatters: processed.whyItMatters,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        processedArticles.push(article);
      } catch (error) {
        console.error(`Failed to process article ${i + 1}:`, error);
      }
    }
    
    // Step 3: Update local storage
    console.log('💾 Storing articles locally...');
    updateRealArticles(processedArticles);
    
    const executionTime = (Date.now() - startTime) / 1000;
    
    console.log('🎉 LOCAL PIPELINE EXECUTION COMPLETE!');
    console.log('=====================================');
    console.log(`✅ Articles processed: ${rawArticles.length}`);
    console.log(`✅ Articles saved locally: ${processedArticles.length}`);
    console.log(`⏱️ Execution time: ${executionTime}s`);
    
    return NextResponse.json({
      success: true,
      message: 'Pipeline executed successfully with local storage',
      data: {
        articlesProcessed: rawArticles.length,
        articlesSaved: processedArticles.length,
        executionTimeSeconds: executionTime,
        articles: processedArticles
      }
    });
    
  } catch (error) {
    console.error('❌ Pipeline execution failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Pipeline execution failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
