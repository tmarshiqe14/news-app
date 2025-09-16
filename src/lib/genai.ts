import { GoogleGenerativeAI } from '@google/generative-ai';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('Please define the GOOGLE_API_KEY environment variable inside .env.local');
}

// Initialize Google GenAI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Get the Gemini model (using stable version with higher quota)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default model;

// Helper function to generate article summary
export async function generateArticleSummary(articleContent: string): Promise<string> {
  try {
    const prompt = `Please provide a concise, 2-3 sentence summary of the following article content. Focus on the key points and main takeaways:

${articleContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating article summary:', error);
    throw error;
  }
}

// Helper function to generate detailed summary
export async function generateDetailedSummary(articleContent: string): Promise<string> {
  try {
    const prompt = `Please provide a detailed, two-paragraph summary of the following article content. Write in simple, accessible language and format it into exactly two paragraphs:

${articleContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating detailed summary:', error);
    throw error;
  }
}

// Helper function to generate "Why it Matters" section
export async function generateWhyItMatters(articleContent: string): Promise<string> {
  try {
    const prompt = `Please write a single paragraph explaining "Why it Matters" for the following article content. Write this specifically for AI enthusiasts and learners, explaining the significance and implications in an engaging way:

${articleContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating why it matters section:', error);
    throw error;
  }
}

// Helper function for chatbot responses
export async function generateChatbotResponse(question: string, articleContent: string): Promise<string> {
  try {
    const prompt = `You are an AI assistant helping users understand news articles. Based on the following article content, answer the user's question in a helpful and informative way:

Article Content:
${articleContent}

User Question: ${question}

Please provide a clear, concise answer based on the article content. If the question cannot be answered from the article, politely explain that you can only answer questions about this specific article.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    throw error;
  }
}

// General AI content generation function
export async function generateAIContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw error;
  }
}
