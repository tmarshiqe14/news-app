'use client';

import React, { useState, useEffect } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp } from 'lucide-react';

interface Article {
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
}


export default function HomePage() {
  const categories = ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'];
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles', {
          cache: 'no-store'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Failed to fetch articles:', response.status, data);
          setError(data.message || 'Failed to fetch articles');
          setSource(data.source || 'unknown');
          return;
        }
        
        if (data.success) {
          setArticles(data.articles || []);
          setSource(data.source || 'unknown');
          setError(null);
        } else {
          setError(data.message || 'No articles available');
          setSource(data.source || 'unknown');
          setArticles([]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Network error - unable to fetch articles');
        setSource('error');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI News Hub
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Latest Updates</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Latest in AI, Technology & Innovation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Stay ahead with AI-powered insights, cutting-edge tech news, and expert analysis from the world's leading sources.
          </p>
          
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Database Connection Status */}
        {!loading && (
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              source === 'mongodb' ? 'bg-green-100 text-green-800' :
              source === 'error' ? 'bg-red-100 text-red-800' :
              source === 'mock-connection-error' ? 'bg-orange-100 text-orange-800' :
              source === 'mock-fallback' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {source === 'mongodb' && '🟢 Connected to MongoDB'}
              {source === 'error' && '🔴 Database Connection Failed'}
              {source === 'database-empty' && '🟡 Database Empty'}
              {source === 'mock-connection-error' && '🟠 Using Mock Data (DB Connection Failed)'}
              {source === 'mock-fallback' && '🔵 Using Mock Data (DB Empty)'}
              {!['mongodb', 'error', 'database-empty', 'mock-connection-error', 'mock-fallback'].includes(source) && `🟡 Using ${source} data`}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Loading articles...</p>
              <p className="text-sm">Connecting to database and fetching articles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg text-red-600">Database Connection Issue</p>
              <p className="text-sm mb-4">{error}</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This demonstrates the transition from mock data to live MongoDB. 
                  The connection may fail due to IP whitelisting, but the application gracefully handles errors.
                </p>
              </div>
            </div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {articles.length} articles from {source === 'mongodb' ? 'MongoDB database' : 'alternative source'}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No articles available</p>
              <p className="text-sm">Database is empty or unavailable</p>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {articles.length > 0 && (
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{articles.length}</div>
                <div className="text-sm text-muted-foreground">Latest Articles</div>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Array.from(new Set(articles.map(a => a.category))).length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Array.from(new Set(articles.map(a => a.publisherName))).length}
                </div>
                <div className="text-sm text-muted-foreground">Publishers</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}