import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import axios from 'axios';
import { generateArticleSummary } from '@/lib/genai';

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    services: {
      mongodb: { status: 'pending', message: '', details: null },
      newsapi: { status: 'pending', message: '', details: null },
      genai: { status: 'pending', message: '', details: null }
    },
    environment: {
      mongodb_uri: process.env.MONGODB_URI ? 'configured' : 'missing',
      news_api_key: process.env.NEWS_API_KEY ? 'configured' : 'missing',
      google_api_key: process.env.GOOGLE_API_KEY ? 'configured' : 'missing'
    }
  };

  // Test MongoDB Connection
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'ADD YOUR CONNECTION STRING HERE') {
      results.services.mongodb = {
        status: 'error',
        message: 'MongoDB URI not configured',
        details: null
      };
    } else {
      await connectDB();
      results.services.mongodb = {
        status: 'success',
        message: 'MongoDB connection successful',
        details: { connected: true }
      };
    }
  } catch (error: any) {
    results.services.mongodb = {
      status: 'error',
      message: error.message,
      details: null
    };
  }

  // Test News API Connection
  try {
    if (!process.env.NEWS_API_KEY || process.env.NEWS_API_KEY === 'ADD YOUR NEWS API KEY HERE') {
      results.services.newsapi = {
        status: 'error',
        message: 'News API key not configured',
        details: null
      };
    } else {
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          pageSize: 1,
          apiKey: process.env.NEWS_API_KEY
        }
      });
      
      if (response.data.status === 'ok') {
        results.services.newsapi = {
          status: 'success',
          message: 'News API connection successful',
          details: { articlesCount: response.data.articles?.length || 0 }
        };
      } else {
        results.services.newsapi = {
          status: 'error',
          message: `News API error: ${response.data.status}`,
          details: null
        };
      }
    }
  } catch (error: any) {
    results.services.newsapi = {
      status: 'error',
      message: error.response?.data?.message || error.message,
      details: null
    };
  }

  // Test Google GenAI Connection
  try {
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'ADD YOUR GEMINI API KEY HERE') {
      results.services.genai = {
        status: 'error',
        message: 'Google API key not configured',
        details: null
      };
    } else {
      const testContent = 'This is a test article about artificial intelligence and machine learning.';
      const summary = await generateArticleSummary(testContent);
      results.services.genai = {
        status: 'success',
        message: 'Google GenAI connection successful',
        details: { testSummary: summary.substring(0, 100) + '...' }
      };
    }
  } catch (error: any) {
    results.services.genai = {
      status: 'error',
      message: error.message,
      details: null
    };
  }

  // Determine overall status
  const allServicesWorking = Object.values(results.services).every(
    service => service.status === 'success'
  );

  return NextResponse.json({
    ...results,
    overall: {
      status: allServicesWorking ? 'success' : 'partial',
      message: allServicesWorking 
        ? 'All services are working correctly' 
        : 'Some services need configuration'
    }
  });
}
