import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database/connection';
import Article from '@/lib/models/Article';
import Chat from '@/lib/models/Chat';
import { mockArticles, generateMockChats } from '@/lib/database/mockData';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Initializing database connection and mock data...');
    
    // Connect to MongoDB
    await connectToDatabase();
    
    const results = {
      timestamp: new Date().toISOString(),
      connection: { status: 'success', message: 'MongoDB connected successfully' },
      articles: { created: 0, errors: [] as string[] },
      chats: { created: 0, errors: [] as string[] },
      summary: { totalOperations: 0, successful: 0, failed: 0 }
    };

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await Article.deleteMany({});
    await Chat.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert mock articles
    console.log('📝 Inserting mock articles...');
    const insertedArticles = [];
    
    for (const articleData of mockArticles) {
      try {
        const article = new Article(articleData);
        const savedArticle = await article.save();
        insertedArticles.push(savedArticle);
        results.articles.created++;
        console.log(`✅ Article created: ${savedArticle.title.substring(0, 50)}...`);
      } catch (error: any) {
        const errorMsg = `Failed to create article: ${error.message}`;
        results.articles.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    // Insert mock chats
    console.log('💬 Inserting mock chats...');
    const mockChats = generateMockChats(insertedArticles);
    
    for (const chatData of mockChats) {
      try {
        const chat = new Chat(chatData);
        await chat.save();
        results.chats.created++;
        console.log(`✅ Chat created for session: ${chatData.sessionId}`);
      } catch (error: any) {
        const errorMsg = `Failed to create chat: ${error.message}`;
        results.chats.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    // Calculate summary
    results.summary.totalOperations = mockArticles.length + mockChats.length;
    results.summary.successful = results.articles.created + results.chats.created;
    results.summary.failed = results.articles.errors.length + results.chats.errors.length;

    console.log('🎉 Database initialization completed!');
    console.log(`📊 Summary: ${results.summary.successful}/${results.summary.totalOperations} operations successful`);

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully with mock data',
      ...results
    });

  } catch (error: any) {
    console.error('❌ Database initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      connection: { status: 'failed', message: error.message }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get collection statistics
    const articlesCount = await Article.countDocuments();
    const chatsCount = await Chat.countDocuments();
    
    // Get sample data
    const sampleArticles = await Article.find().limit(3).select('title category createdAt');
    const sampleChats = await Chat.find().limit(3).select('sessionId articleTitle messages createdAt');
    
    return NextResponse.json({
      success: true,
      connection: { status: 'connected', message: 'MongoDB connection active' },
      statistics: {
        articles: articlesCount,
        chats: chatsCount,
        totalDocuments: articlesCount + chatsCount
      },
      samples: {
        articles: sampleArticles,
        chats: sampleChats.map(chat => ({
          sessionId: chat.sessionId,
          articleTitle: chat.articleTitle,
          messageCount: chat.messages.length,
          createdAt: chat.createdAt
        }))
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Database status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      connection: { status: 'failed', message: error.message },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
