import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database/connection';
import Article from '@/lib/models/Article';
import mongoose from 'mongoose';

// Helper function to transform MongoDB article to frontend format
const transformArticle = (article: any, id: string) => ({
  id: id,
  title: article.title || '',
  excerpt: article.quickSummary || '',
  content: article.detailedSummary || '',
  imageUrl: article.coverImage || '',
  publisherName: article.publisherName || '',
  publisherLogo: article.publisherLogo || '',
  authorName: article.authorName || '',
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
  category: article.category || '',
  sourceUrl: article.sourceUrl || '',
  whyItMatters: article.whyItMatters || '',
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`🔍 Fetching article ${id} from MongoDB...`);
    
    // Connect to MongoDB using Mongoose
    console.log('🔗 Connecting to MongoDB...');
    await connectToDatabase();
    
    console.log('📊 Fetching article from database...');
    
    let article;
    
    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it's a valid ObjectId, search by _id
      article = await Article.findById(id).lean().exec();
    } else {
      // Otherwise, try to find by index (legacy support)
      const articleIndex = parseInt(id) - 1;
      if (articleIndex >= 0) {
        const articles = await Article.find({})
          .sort({ createdAt: -1 })
          .skip(articleIndex)
          .limit(1)
          .lean()
          .exec();
        article = articles[0] || null;
      }
    }
    
    if (!article) {
      console.log(`❌ Article ${id} not found`);
      return NextResponse.json({
        success: false,
        error: 'Article not found'
      }, { status: 404 });
    }
    
    console.log(`✅ Found article: ${article.title}`);
    
    // Transform MongoDB document using helper function
    const transformedArticle = transformArticle(article, id);

    return NextResponse.json({
      success: true,
      article: transformedArticle,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: 'Unable to connect to database',
      connectionError: error instanceof Error ? error.message : 'Unknown database error'
    }, { status: 500 });
  }
}
