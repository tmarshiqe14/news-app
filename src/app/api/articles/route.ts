import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database/connection';
import Article from '@/lib/models/Article';

// Helper function to transform MongoDB articles to frontend format
const transformArticle = (article: any, index: number) => ({
  id: article._id ? article._id.toString() : (index + 1).toString(),
  title: article.title,
  excerpt: article.quickSummary,
  content: article.detailedSummary,
  imageUrl: article.coverImage,
  publisherName: article.publisherName,
  publisherLogo: article.publisherLogo,
  authorName: article.authorName,
  publishedAt: (() => {
    try {
      if (article.datePosted) {
        const date = new Date(article.datePosted);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      }
      return new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  })(),
  category: article.category,
  sourceUrl: article.sourceUrl,
  whyItMatters: article.whyItMatters,
  createdAt: (() => {
    try {
      if (article.createdAt) {
        const date = new Date(article.createdAt);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      }
      return new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  })(),
  updatedAt: (() => {
    try {
      if (article.updatedAt) {
        const date = new Date(article.updatedAt);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      }
      return new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  })()
});

export async function GET() {
  console.log('🔍 Fetching articles from MongoDB...');
  
  try {
    // Connect to MongoDB using Mongoose
    console.log('🔗 Connecting to MongoDB...');
    await connectToDatabase();
    
    console.log('📊 Fetching articles from database...');
    // Fetch all articles using Mongoose model, sorted by creation date (newest first)
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .lean() // Use lean() for better performance when we don't need full Mongoose documents
      .exec();
    
    console.log(`✅ Found ${articles.length} articles in MongoDB`);
    
    if (articles.length === 0) {
      console.log('❌ No articles found in database');
      return NextResponse.json({
        success: false,
        message: 'No articles found in database',
        articles: [],
        count: 0,
        source: 'mongodb'
      }, { status: 404 });
    }

    // Transform articles using the helper function
    const transformedArticles = articles.map((article, index) => transformArticle(article, index));

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      count: transformedArticles.length,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      articles: [],
      count: 0,
      source: 'mongodb',
      error: error instanceof Error ? error.message : 'Unknown database error'
    }, { status: 500 });
  }
}
