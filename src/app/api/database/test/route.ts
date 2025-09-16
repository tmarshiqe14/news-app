import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    const results = {
      timestamp: new Date().toISOString(),
      validationTests: {
        articles: {
          validData: { success: false, message: '' },
          invalidData: { success: false, message: '' }
        },
        chats: {
          validData: { success: false, message: '' },
          invalidData: { success: false, message: '' }
        }
      }
    };

    const articlesCollection = db.collection('articles');
    const chatsCollection = db.collection('chats');

    // Test 1: Valid Article Data
    const validArticle = {
      title: "Test Article: AI Breakthrough in Natural Language Processing",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      publisherName: "AI Research Today",
      publisherLogo: "https://example.com/logo.png",
      authorName: "Dr. Jane Smith",
      datePosted: new Date(),
      quickSummary: "A comprehensive look at the latest breakthroughs in natural language processing, highlighting key innovations and their potential impact on the field.",
      detailedSummary: "Recent advancements in natural language processing have opened new possibilities for human-computer interaction. This article explores the technical details of transformer architectures, attention mechanisms, and their applications in real-world scenarios. The research demonstrates significant improvements in language understanding and generation capabilities.",
      whyItMatters: "These developments in NLP technology represent a significant step forward for AI practitioners and enthusiasts. Understanding these innovations is crucial for anyone working in the field of artificial intelligence.",
      sourceUrl: "https://example.com/test-article-" + Date.now(),
      category: "AI",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const result = await articlesCollection.insertOne(validArticle);
      results.validationTests.articles.validData.success = true;
      results.validationTests.articles.validData.message = `Valid article inserted with ID: ${result.insertedId}`;
      
      // Clean up test data
      await articlesCollection.deleteOne({ _id: result.insertedId });
    } catch (error: any) {
      results.validationTests.articles.validData.success = false;
      results.validationTests.articles.validData.message = `Unexpected error: ${error.message}`;
    }

    // Test 2: Invalid Article Data (should fail validation)
    const invalidArticle = {
      title: "Short", // Too short (min 10 characters)
      coverImage: "not-a-valid-url", // Invalid URL pattern
      publisherName: "P", // Too short (min 2 characters)
      authorName: "A", // Too short (min 2 characters)
      datePosted: "not-a-date", // Invalid date type
      quickSummary: "Too short", // Too short (min 50 characters)
      detailedSummary: "Also too short", // Too short (min 100 characters)
      whyItMatters: "Short", // Too short (min 50 characters)
      sourceUrl: "invalid-url", // Invalid URL pattern
      category: "InvalidCategory", // Not in enum
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await articlesCollection.insertOne(invalidArticle);
      results.validationTests.articles.invalidData.success = false;
      results.validationTests.articles.invalidData.message = "ERROR: Invalid data was accepted (validation not working)";
    } catch (error: any) {
      results.validationTests.articles.invalidData.success = true;
      results.validationTests.articles.invalidData.message = `✅ Validation working: ${error.message}`;
    }

    // Test 3: Valid Chat Data
    const validChat = {
      sessionId: "test_session_" + Date.now(),
      articleId: new mongoose.Types.ObjectId(),
      articleTitle: "Test Article: AI Breakthrough in Natural Language Processing",
      messages: [
        {
          text: "What are the key findings in this research?",
          isUser: true,
          timestamp: new Date()
        },
        {
          text: "The key findings include significant improvements in language understanding and generation capabilities through advanced transformer architectures.",
          isUser: false,
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const result = await chatsCollection.insertOne(validChat);
      results.validationTests.chats.validData.success = true;
      results.validationTests.chats.validData.message = `Valid chat inserted with ID: ${result.insertedId}`;
      
      // Clean up test data
      await chatsCollection.deleteOne({ _id: result.insertedId });
    } catch (error: any) {
      results.validationTests.chats.validData.success = false;
      results.validationTests.chats.validData.message = `Unexpected error: ${error.message}`;
    }

    // Test 4: Invalid Chat Data (should fail validation)
    const invalidChat = {
      sessionId: "short", // Too short (min 10 characters)
      articleId: "not-an-objectid", // Invalid ObjectId
      articleTitle: "Short", // Too short (min 10 characters)
      messages: [
        {
          text: "", // Empty text (min 1 character)
          isUser: "not-a-boolean", // Invalid boolean type
          timestamp: "not-a-date" // Invalid date type
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await chatsCollection.insertOne(invalidChat);
      results.validationTests.chats.invalidData.success = false;
      results.validationTests.chats.invalidData.message = "ERROR: Invalid data was accepted (validation not working)";
    } catch (error: any) {
      results.validationTests.chats.invalidData.success = true;
      results.validationTests.chats.invalidData.message = `✅ Validation working: ${error.message}`;
    }

    const allValidationsPassed = 
      results.validationTests.articles.validData.success &&
      results.validationTests.articles.invalidData.success &&
      results.validationTests.chats.validData.success &&
      results.validationTests.chats.invalidData.success;

    return NextResponse.json({
      success: allValidationsPassed,
      message: allValidationsPassed ? 
        'All schema validation tests passed!' : 
        'Some validation tests failed',
      ...results
    });

  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}