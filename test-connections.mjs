import mongoose from 'mongoose';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔧 Testing AI News Hub Service Connections...\n');

// Test MongoDB Connection
async function testMongoDB() {
  console.log('📊 Testing MongoDB Connection...');
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI || MONGODB_URI === 'ADD YOUR CONNECTION STRING HERE') {
      console.log('❌ MongoDB: No connection string provided');
      return false;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB: Connection successful');
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.log('❌ MongoDB: Connection failed -', error.message);
    return false;
  }
}

// Test News API Connection
async function testNewsAPI() {
  console.log('📰 Testing News API Connection...');
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY || NEWS_API_KEY === 'ADD YOUR NEWS API KEY HERE') {
      console.log('❌ News API: No API key provided');
      return false;
    }

    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`);
    
    if (response.status === 200) {
      console.log('✅ News API: Authentication successful');
      return true;
    } else {
      console.log('❌ News API: Authentication failed');
      return false;
    }
  } catch (error) {
    console.log('❌ News API: Connection failed -', error.message);
    return false;
  }
}

// Test Google GenAI Connection
async function testGoogleGenAI() {
  console.log('🤖 Testing Google GenAI Connection...');
  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'ADD YOUR GEMINI API KEY HERE') {
      console.log('❌ Google GenAI: No API key provided');
      return false;
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent('Hello, this is a test message.');
    const response = await result.response;
    
    if (response.text()) {
      console.log('✅ Google GenAI: Authentication successful');
      return true;
    } else {
      console.log('❌ Google GenAI: Authentication failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Google GenAI: Connection failed -', error.message);
    return false;
  }
}

// Test Environment Variables
function testEnvironmentVariables() {
  console.log('🔑 Testing Environment Variables...');
  
  const requiredVars = ['MONGODB_URI', 'NEWS_API_KEY', 'GOOGLE_API_KEY'];
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('ADD YOUR')) {
      console.log(`❌ ${varName}: Not configured`);
      allPresent = false;
    } else {
      console.log(`✅ ${varName}: Configured`);
    }
  });
  
  return allPresent;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Phase 2 Service Connection Tests\n');
  
  const envTest = testEnvironmentVariables();
  console.log('');
  
  const mongoTest = await testMongoDB();
  console.log('');
  
  const newsTest = await testNewsAPI();
  console.log('');
  
  const genaiTest = await testGoogleGenAI();
  console.log('');
  
  // Summary
  console.log('📋 Test Summary:');
  console.log('================');
  console.log(`Environment Variables: ${envTest ? '✅' : '❌'}`);
  console.log(`MongoDB Connection: ${mongoTest ? '✅' : '❌'}`);
  console.log(`News API Connection: ${newsTest ? '✅' : '❌'}`);
  console.log(`Google GenAI Connection: ${genaiTest ? '✅' : '❌'}`);
  
  const allPassed = envTest && mongoTest && newsTest && genaiTest;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Phase 2 setup is complete.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your configuration.');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env.local file with actual API keys');
    console.log('2. Run this test again: npm run test:connections');
  }
  
  process.exit(allPassed ? 0 : 1);
}

runAllTests().catch(console.error);