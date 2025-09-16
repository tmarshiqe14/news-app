import { NextRequest, NextResponse } from 'next/server';
import { NewsPipeline } from '@/lib/pipeline/newsPipeline';

export async function POST(request: NextRequest) {
  console.log('🚀 NEWS PIPELINE API ENDPOINT CALLED');
  console.log('===================================');

  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const targetCount = body.targetCount || 10;
    const isTest = body.test || false;

    console.log(`📊 Configuration:`);
    console.log(`   Target articles: ${targetCount}`);
    console.log(`   Test mode: ${isTest}`);
    console.log('');

    // Initialize and execute pipeline
    const pipeline = new NewsPipeline();
    
    const result = isTest 
      ? await pipeline.executeTest()
      : await pipeline.execute(targetCount);

    // Return detailed results
    const response = {
      success: result.success,
      message: result.success 
        ? `Successfully processed and saved ${result.articlesSaved} articles`
        : 'Pipeline execution failed',
      data: {
        articlesProcessed: result.articlesProcessed,
        articlesSaved: result.articlesSaved,
        executionTimeSeconds: Math.round(result.executionTime / 1000),
        errors: result.errors
      },
      timestamp: new Date().toISOString()
    };

    const statusCode = result.success ? 200 : 500;
    
    console.log(`📊 API Response Status: ${statusCode}`);
    console.log(`📊 Success: ${result.success}`);
    console.log(`📊 Articles Saved: ${result.articlesSaved}`);
    
    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    console.error('❌ API ENDPOINT ERROR:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      message: 'Pipeline execution failed',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log('📊 PIPELINE STATUS CHECK');
  console.log('=======================');

  try {
    const pipeline = new NewsPipeline();
    const status = await pipeline.getDatabaseStatus();

    console.log(`📊 Current article count: ${status.articleCount}`);
    
    return NextResponse.json({
      success: true,
      data: {
        articleCount: status.articleCount,
        sampleArticles: status.sampleArticles.map(article => ({
          title: article.title,
          publisher: article.publisherName,
          category: article.category,
          created: article.createdAt
        }))
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ STATUS CHECK ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
