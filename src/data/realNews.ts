import fs from 'fs';
import path from 'path';

// This file will store real news articles fetched from the pipeline
export interface RealArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publisherName: string;
  publisherLogo?: string;
  authorName: string;
  publishedAt: string;
  category: string;
  sourceUrl: string;
  whyItMatters: string;
  createdAt: string;
  updatedAt: string;
}

const ARTICLES_FILE = path.join(process.cwd(), 'real-articles.json');

// Function to update real articles
export function updateRealArticles(articles: RealArticle[]) {
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    console.log(`✅ Saved ${articles.length} real articles to ${ARTICLES_FILE}`);
  } catch (error) {
    console.error('❌ Failed to save articles:', error);
  }
}

// Function to get real articles
export function getRealArticles(): RealArticle[] {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
      const articles = JSON.parse(data);
      console.log(`📖 Loaded ${articles.length} real articles from file`);
      return articles;
    }
  } catch (error) {
    console.error('❌ Failed to load articles:', error);
  }
  return [];
}
