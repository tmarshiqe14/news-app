import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { testNewsApiConnection } from '@/lib/news-api';
import { testGeminiConnection } from '@/lib/gemini';

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  const results: TestResult[] = [];
  const timestamp = new Date().toISOString();

  // Test MongoDB Connection
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    results.push({
      service: 'MongoDB',
      status: 'success',
      message: 'Successfully connected to MongoDB',
      timestamp
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    results.push({
      service: 'MongoDB',
      status: 'error',
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp
    });
  }

  // Test News API Connection
  try {
    console.log('Testing News API connection...');
    const newsApiSuccess = await testNewsApiConnection();
    results.push({
      service: 'News API',
      status: newsApiSuccess ? 'success' : 'error',
      message: newsApiSuccess ? 'Successfully authenticated with News API' : 'Authentication failed',
      timestamp
    });
  } catch (error) {
    console.error('News API connection failed:', error);
    results.push({
      service: 'News API',
      status: 'error',
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp
    });
  }

  // Test Gemini API Connection
  try {
    console.log('Testing Gemini API connection...');
    const geminiSuccess = await testGeminiConnection();
    results.push({
      service: 'Gemini API',
      status: geminiSuccess ? 'success' : 'error',
      message: geminiSuccess ? 'Successfully authenticated with Gemini API' : 'Authentication failed',
      timestamp
    });
  } catch (error) {
    console.error('Gemini API connection failed:', error);
    results.push({
      service: 'Gemini API',
      status: 'error',
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp
    });
  }

  // Check environment variables
  const envVars = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEWS_API_KEY: !!process.env.NEWS_API_KEY,
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
  };

  const allEnvVarsPresent = Object.values(envVars).every(Boolean);
  
  results.push({
    service: 'Environment Variables',
    status: allEnvVarsPresent ? 'success' : 'error',
    message: allEnvVarsPresent 
      ? 'All required environment variables are present'
      : `Missing variables: ${Object.entries(envVars).filter(([_, present]) => !present).map(([key]) => key).join(', ')}`,
    timestamp
  });

  // Determine overall status
  const allServicesWorking = results.every(result => result.status === 'success');
  const overallStatus = allServicesWorking ? 'success' : 'partial';

  return NextResponse.json({
    status: overallStatus,
    message: allServicesWorking 
      ? 'All services are configured and working correctly!' 
      : 'Some services have configuration issues. Check the results below.',
    timestamp,
    results,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    }
  }, {
    status: allServicesWorking ? 200 : 207 // 207 Multi-Status for partial success
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Use GET method to test service connections',
    methods: ['GET']
  }, { status: 405 });
}
