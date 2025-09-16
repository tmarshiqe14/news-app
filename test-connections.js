#!/usr/bin/env node

/**
 * Standalone test script to verify all service connections
 * Run with: node test-connections.js
 */

import mongoose from 'mongoose';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🔧 Testing AI News Hub Service Connections...\n');

const results = {
  environment: false,
  mongodb: false,
  newsApi: false,
  gemini: false
};

// Test Environment Variables
console.log('1️⃣ Testing Environment Variables...');
const requiredEnvVars = ['MONGODB_URI', 'NEWS_API_KEY', 'GOOGLE_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName].includes('ADD YOUR'));

if (missingVars.length === 0) {
  console.log('✅ All environment variables are present');
  results.environment = true;
} else {
  console.log(`❌ Missing or placeholder environment variables: ${missingVars.join(', ')}`);
  console.log('   Please update your .env.local file with actual values');
}

// Test MongoDB Connection
console.log('\n2️⃣ Testing MongoDB Connection...');
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('ADD YOUR')) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connection successful');
    await mongoose.disconnect();
    results.mongodb = true;
  } catch (error) {
    console.log(`❌ MongoDB connection failed: ${error.message}`);
  }
} else {
  console.log('❌ MongoDB URI not configured');
}

// Test News API Connection
console.log('\n3️⃣ Testing News API Connection...');
if (process.env.NEWS_API_KEY && !process.env.NEWS_API_KEY.includes('ADD YOUR')) {
  try {
    const response = await axios.get('https://newsapi.org/v2/sources', {
      headers: {
        'X-API-Key': process.env.NEWS_API_KEY
      },
      timeout: 5000,
      params: {
        category: 'technology',
        language: 'en',
        pageSize: 1
      }
    });
    
    if (response.status === 200) {
      console.log('✅ News API authentication successful');
      results.newsApi = true;
    } else {
      console.log(`❌ News API returned status: ${response.status}`);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ News API authentication failed - check your API key');
    } else {
      console.log(`❌ News API connection failed: ${error.message}`);
    }
  }
} else {
  console.log('❌ News API key not configured');
}

// Test Gemini API Connection
console.log('\n4️⃣ Testing Gemini API Connection...');
if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY.includes('ADD YOUR')) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent("Hello, this is a connection test. Please respond with 'Connection successful'.");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API authentication successful');
    console.log(`   Response: ${text.substring(0, 100)}...`);
    results.gemini = true;
  } catch (error) {
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('❌ Gemini API authentication failed - check your API key');
    } else {
      console.log(`❌ Gemini API connection failed: ${error.message}`);
    }
  }
} else {
  console.log('❌ Google API key not configured');
}

// Summary
console.log('\n📊 Test Summary:');
console.log('================');
console.log(`Environment Variables: ${results.environment ? '✅' : '❌'}`);
console.log(`MongoDB: ${results.mongodb ? '✅' : '❌'}`);
console.log(`News API: ${results.newsApi ? '✅' : '❌'}`);
console.log(`Gemini API: ${results.gemini ? '✅' : '❌'}`);

const allPassed = Object.values(results).every(Boolean);
console.log(`\n${allPassed ? '🎉 All tests passed! Your setup is ready.' : '⚠️  Some tests failed. Please check your configuration.'}`);

if (!allPassed) {
  console.log('\n📝 Next Steps:');
  console.log('1. Update your .env.local file with actual API keys and connection strings');
  console.log('2. Make sure your MongoDB URI is accessible from your network');
  console.log('3. Verify your API keys are valid and have proper permissions');
  console.log('4. Run this test again: node test-connections.js');
}

process.exit(allPassed ? 0 : 1);
