import axios, { AxiosInstance } from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

if (!NEWS_API_KEY) {
  throw new Error('Please define the NEWS_API_KEY environment variable inside .env.local');
}

// Create axios instance for News API
const newsApiClient: AxiosInstance = axios.create({
  baseURL: NEWS_API_BASE_URL,
  headers: {
    'X-API-Key': NEWS_API_KEY,
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
newsApiClient.interceptors.request.use(
  (config) => {
    console.log(`Making News API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('News API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
newsApiClient.interceptors.response.use(
  (response) => {
    console.log(`News API response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('News API response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default newsApiClient;

// Helper function to test News API connection
export async function testNewsApiConnection(): Promise<boolean> {
  try {
    const response = await newsApiClient.get('/sources?category=technology&language=en&pageSize=1');
    return response.status === 200;
  } catch (error) {
    console.error('News API connection test failed:', error);
    return false;
  }
}
