import { NextRequest, NextResponse } from 'next/server';
import { SimplePipeline } from '@/lib/pipeline/simplePipeline';

export async function POST(request: NextRequest) {
  console.log('🚀 SIMPLE PIPELINE API ENDPOINT CALLED');
  console.log('=====================================');

  try {
    const body = await request.json().catch(() => ({}));
    const targetCount = body.targetCount || 10;

    console.log(`📊 Target articles: ${targetCount}`);
    console.log('');

    const pipeline = new SimplePipeline();
    const result = await pipeline.execute(targetCount);

    const response = {
      success: result.success,
      message: result.success 
        ? `Successfully processed and saved ${result.articlesSaved} articles`
        : 'Pipeline execution failed',
      data: {
        articlesProcessed: result.articlesProcessed,
        articlesSaved: result.articlesSaved,
        errors: result.errors
      },
      timestamp: new Date().toISOString()
    };

    const statusCode = result.success ? 200 : 500;
    
    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    console.error('❌ SIMPLE PIPELINE ERROR:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Pipeline execution failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
