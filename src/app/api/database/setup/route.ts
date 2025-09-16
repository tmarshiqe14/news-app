import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { articlesCollectionSchema, chatsCollectionSchema, sampleArticle, sampleChat } from '@/lib/database-schema';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const db = mongoose.connection.db;
    const results = {
      timestamp: new Date().toISOString(),
      operations: [] as any[],
      collections: {
        articles: { created: false, validated: false, indexed: false },
        chats: { created: false, validated: false, indexed: false }
      },
      sampleData: {
        articles: { inserted: false, count: 0 },
        chats: { inserted: false, count: 0 }
      }
    };

    // 1. Create Articles Collection with Schema Validation
    try {
      await db.createCollection('articles', {
        validator: articlesCollectionSchema
      });
      results.collections.articles.created = true;
      results.operations.push('✅ Articles collection created with schema validation');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        // Collection exists, update validation rules
        await db.command({
          collMod: 'articles',
          validator: articlesCollectionSchema
        });
        results.collections.articles.created = true;
        results.operations.push('✅ Articles collection validation rules updated');
      } else {
        throw error;
      }
    }

    // 2. Create Chats Collection with Schema Validation
    try {
      await db.createCollection('chats', {
        validator: chatsCollectionSchema
      });
      results.collections.chats.created = true;
      results.operations.push('✅ Chats collection created with schema validation');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        // Collection exists, update validation rules
        await db.command({
          collMod: 'chats',
          validator: chatsCollectionSchema
        });
        results.collections.chats.created = true;
        results.operations.push('✅ Chats collection validation rules updated');
      } else {
        throw error;
      }
    }

    // 3. Create Indexes for Articles Collection
    const articlesCollection = db.collection('articles');
    await articlesCollection.createIndex({ sourceUrl: 1 }, { unique: true });
    await articlesCollection.createIndex({ category: 1 });
    await articlesCollection.createIndex({ datePosted: -1 });
    await articlesCollection.createIndex({ createdAt: -1 });
    results.collections.articles.indexed = true;
    results.operations.push('✅ Articles collection indexes created');

    // 4. Create Indexes for Chats Collection
    const chatsCollection = db.collection('chats');
    await chatsCollection.createIndex({ sessionId: 1 }, { unique: true });
    await chatsCollection.createIndex({ articleId: 1 });
    await chatsCollection.createIndex({ createdAt: -1 });
    results.collections.chats.indexed = true;
    results.operations.push('✅ Chats collection indexes created');

    // 5. Verify Schema Validation
    const articlesInfo = await db.listCollections({ name: 'articles' }).toArray();
    const chatsInfo = await db.listCollections({ name: 'chats' }).toArray();
    
    results.collections.articles.validated = articlesInfo[0]?.options?.validator ? true : false;
    results.collections.chats.validated = chatsInfo[0]?.options?.validator ? true : false;

    if (results.collections.articles.validated) {
      results.operations.push('✅ Articles schema validation confirmed');
    }
    if (results.collections.chats.validated) {
      results.operations.push('✅ Chats schema validation confirmed');
    }

    // 6. Insert Sample Data
    try {
      // Insert sample article
      const articleResult = await articlesCollection.insertOne(sampleArticle);
      results.sampleData.articles.inserted = true;
      results.sampleData.articles.count = 1;
      results.operations.push('✅ Sample article inserted');

      // Insert sample chat (with reference to the article)
      const sampleChatWithRef = {
        ...sampleChat,
        articleId: articleResult.insertedId
      };
      await chatsCollection.insertOne(sampleChatWithRef);
      results.sampleData.chats.inserted = true;
      results.sampleData.chats.count = 1;
      results.operations.push('✅ Sample chat inserted');
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        results.operations.push('⚠️ Sample data already exists (skipped)');
      } else {
        results.operations.push(`⚠️ Sample data insertion failed: ${error.message}`);
      }
    }

    const allSuccess = results.collections.articles.created && 
                      results.collections.articles.validated &&
                      results.collections.chats.created && 
                      results.collections.chats.validated;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? 
        'Database schema setup completed successfully!' : 
        'Database schema setup completed with some issues',
      ...results
    });

  } catch (error: any) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}