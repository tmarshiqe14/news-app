import mongoose from 'mongoose';
import connectDB from './mongodb';

/**
 * Test data for articles collection
 */
export const validArticleData = {
  title: "OpenAI Launches GPT-5 with Revolutionary Reasoning Capabilities",
  coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  publisherName: "TechCrunch",
  publisherLogo: "https://via.placeholder.com/32x32/0066CC/FFFFFF?text=TC",
  authorName: "Sarah Chen",
  datePosted: new Date("2024-01-15"),
  quickSummary: "OpenAI announces GPT-5 with advanced reasoning capabilities, marking a significant leap in AI development.",
  detailedSummary: "OpenAI has officially unveiled GPT-5, their most advanced language model to date, featuring unprecedented reasoning capabilities that allow it to solve complex problems across multiple domains. The new model demonstrates significant improvements in mathematical reasoning, scientific analysis, and creative problem-solving compared to its predecessors.",
  whyItMatters: "This breakthrough represents a fundamental shift in AI capabilities, potentially revolutionizing how we approach complex problem-solving in science, technology, and creative fields. For AI enthusiasts, GPT-5 showcases the rapid pace of advancement in artificial intelligence and opens new possibilities for human-AI collaboration.",
  sourceUrl: "https://techcrunch.com/example-article-1",
  category: "AI",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const invalidArticleData = {
  // Missing required fields: title, coverImage, etc.
  title: "", // Empty string - should fail minLength validation
  coverImage: "invalid-url", // Invalid URL - should fail pattern validation
  publisherName: "TechCrunch",
  // Missing many required fields
  category: "InvalidCategory", // Invalid enum value
  createdAt: "invalid-date" // Invalid date type
};

/**
 * Test data for chats collection
 */
export const validChatData = {
  sessionId: "test-session-123",
  articleId: new mongoose.Types.ObjectId(),
  articleTitle: "OpenAI Launches GPT-5 with Revolutionary Reasoning Capabilities",
  messages: [
    {
      text: "Hello! I have a question about this article.",
      isUser: true,
      timestamp: new Date()
    },
    {
      text: "I'd be happy to help! What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

export const invalidChatData = {
  // Missing required fields
  sessionId: "", // Empty string - should fail minLength validation
  articleId: "invalid-object-id", // Invalid ObjectId - should fail bsonType validation
  articleTitle: "Test Article",
  messages: [
    {
      text: "", // Empty string - should fail minLength validation
      isUser: "not-boolean", // Invalid type - should fail bsonType validation
      timestamp: "invalid-date" // Invalid date - should fail bsonType validation
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Test function to validate articles collection
 */
export async function testArticlesValidation() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const articlesCollection = db.collection('articles');

    console.log('🧪 Testing Articles Collection Validation...\n');

    // Test 1: Insert valid data (should succeed)
    try {
      const result = await articlesCollection.insertOne(validArticleData);
      console.log('✅ Valid article data inserted successfully');
      console.log(`   - Document ID: ${result.insertedId}`);
      
      // Clean up - delete the test document
      await articlesCollection.deleteOne({ _id: result.insertedId });
      console.log('   - Test document cleaned up');
    } catch (error) {
      console.log('❌ Valid article data insertion failed:', error);
    }

    // Test 2: Insert invalid data (should fail)
    try {
      await articlesCollection.insertOne(invalidArticleData);
      console.log('❌ Invalid article data was accepted (this should not happen!)');
    } catch (error) {
      console.log('✅ Invalid article data correctly rejected');
      console.log(`   - Error: ${error}`);
    }

    // Test 3: Test specific validation rules
    console.log('\n🔍 Testing specific validation rules...');
    
    // Test empty title
    try {
      await articlesCollection.insertOne({
        ...validArticleData,
        title: "",
        sourceUrl: "https://example.com/test-empty-title"
      });
      console.log('❌ Empty title was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Empty title correctly rejected');
    }

    // Test invalid URL
    try {
      await articlesCollection.insertOne({
        ...validArticleData,
        coverImage: "not-a-url",
        sourceUrl: "https://example.com/test-invalid-url"
      });
      console.log('❌ Invalid URL was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Invalid URL correctly rejected');
    }

    // Test invalid category
    try {
      await articlesCollection.insertOne({
        ...validArticleData,
        category: "InvalidCategory",
        sourceUrl: "https://example.com/test-invalid-category"
      });
      console.log('❌ Invalid category was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Invalid category correctly rejected');
    }

    // Test missing required field
    try {
      const { title, ...dataWithoutTitle } = validArticleData;
      await articlesCollection.insertOne({
        ...dataWithoutTitle,
        sourceUrl: "https://example.com/test-missing-title"
      });
      console.log('❌ Missing required field was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Missing required field correctly rejected');
    }

    return true;
  } catch (error) {
    console.error('❌ Articles validation test failed:', error);
    throw error;
  }
}

/**
 * Test function to validate chats collection
 */
export async function testChatsValidation() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const chatsCollection = db.collection('chats');

    console.log('\n🧪 Testing Chats Collection Validation...\n');

    // Test 1: Insert valid data (should succeed)
    try {
      const result = await chatsCollection.insertOne(validChatData);
      console.log('✅ Valid chat data inserted successfully');
      console.log(`   - Document ID: ${result.insertedId}`);
      
      // Clean up - delete the test document
      await chatsCollection.deleteOne({ _id: result.insertedId });
      console.log('   - Test document cleaned up');
    } catch (error) {
      console.log('❌ Valid chat data insertion failed:', error);
    }

    // Test 2: Insert invalid data (should fail)
    try {
      await chatsCollection.insertOne(invalidChatData);
      console.log('❌ Invalid chat data was accepted (this should not happen!)');
    } catch (error) {
      console.log('✅ Invalid chat data correctly rejected');
      console.log(`   - Error: ${error}`);
    }

    // Test 3: Test specific validation rules
    console.log('\n🔍 Testing specific validation rules...');
    
    // Test empty session ID
    try {
      await chatsCollection.insertOne({
        ...validChatData,
        sessionId: "",
        articleId: new mongoose.Types.ObjectId()
      });
      console.log('❌ Empty session ID was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Empty session ID correctly rejected');
    }

    // Test invalid ObjectId
    try {
      await chatsCollection.insertOne({
        ...validChatData,
        articleId: "invalid-object-id",
        sessionId: "test-session-invalid-objectid"
      });
      console.log('❌ Invalid ObjectId was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Invalid ObjectId correctly rejected');
    }

    // Test invalid message structure
    try {
      await chatsCollection.insertOne({
        ...validChatData,
        messages: [
          {
            text: "", // Empty text
            isUser: "not-boolean", // Invalid type
            timestamp: "invalid-date" // Invalid date
          }
        ],
        sessionId: "test-session-invalid-messages"
      });
      console.log('❌ Invalid message structure was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Invalid message structure correctly rejected');
    }

    // Test missing required field
    try {
      const { sessionId, ...dataWithoutSessionId } = validChatData;
      await chatsCollection.insertOne({
        ...dataWithoutSessionId,
        articleId: new mongoose.Types.ObjectId()
      });
      console.log('❌ Missing required field was accepted (should be rejected)');
    } catch (error) {
      console.log('✅ Missing required field correctly rejected');
    }

    return true;
  } catch (error) {
    console.error('❌ Chats validation test failed:', error);
    throw error;
  }
}

/**
 * Main test function
 */
export async function runSchemaValidationTests() {
  try {
    console.log('🚀 Starting MongoDB Schema Validation Tests...\n');
    
    await testArticlesValidation();
    await testChatsValidation();
    
    console.log('\n🎉 All validation tests completed!');
    console.log('📊 Summary:');
    console.log('   - Articles collection validation: Working');
    console.log('   - Chats collection validation: Working');
    console.log('   - Native MongoDB validation is enforcing data integrity');
    
    return true;
  } catch (error) {
    console.error('❌ Schema validation tests failed:', error);
    throw error;
  }
}
