import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('Please define the GOOGLE_API_KEY environment variable inside .env.local');
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Get the Gemini 2.5 Flash model
const model: GenerativeModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp" 
});

export default model;

// Helper function to test Gemini API connection
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const prompt = "Hello, this is a connection test. Please respond with 'Connection successful'.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini API response:', text);
    return text.includes('Connection successful') || text.length > 0;
  } catch (error) {
    console.error('Gemini API connection test failed:', error);
    return false;
  }
}

// Helper function to generate article summary
export async function generateArticleSummary(articleContent: string): Promise<string> {
  try {
    const prompt = `
Please provide a concise, informative summary of the following article in 2-3 sentences. 
Focus on the key points and main takeaways. Make it engaging and accessible to AI enthusiasts.

Article content:
${articleContent}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating article summary:', error);
    throw new Error('Failed to generate article summary');
  }
}

// Helper function to generate "Why it Matters" section
export async function generateWhyItMatters(articleContent: string): Promise<string> {
  try {
    const prompt = `
Based on the following article, write a single paragraph explaining "Why it Matters" 
specifically for AI enthusiasts and learners. Focus on the implications, significance, 
and what this means for the future of AI and technology.

Article content:
${articleContent}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating "Why it Matters" section:', error);
    throw new Error('Failed to generate "Why it Matters" section');
  }
}
