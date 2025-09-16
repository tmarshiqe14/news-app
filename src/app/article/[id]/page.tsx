import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Building2, ExternalLink, Sparkles, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import connectToDatabase from '@/lib/database/connection';
import Article from '@/lib/models/Article';

interface ArticleData {
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

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string): Promise<ArticleData | null> {
  console.log(`🔍 Fetching article ${id} directly from database...`);
  
  try {
    // Try to connect to MongoDB and fetch from database
    await connectToDatabase();
    console.log('🔗 Connected to MongoDB for article fetch');
    
    let article;
    
    // Check if it's a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('📊 Fetching by MongoDB _id...');
      article = await Article.findById(id).lean();
    } else {
      console.log('📊 Invalid MongoDB _id, checking mock data...');
      article = null;
    }
    
    if (article && !Array.isArray(article)) {
      console.log(`✅ Found article in MongoDB: ${article.title || 'Unknown Title'}`);
      
      // Transform MongoDB document to expected format
      return {
        id: article._id?.toString() || id,
        title: article.title || 'Unknown Title',
        excerpt: article.quickSummary || 'No summary available',
        content: article.detailedSummary || 'No content available',
        imageUrl: article.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&fm=jpg',
        publisherName: article.publisherName || 'Unknown Publisher',
        publisherLogo: article.publisherLogo,
        authorName: article.authorName || 'Unknown Author',
        publishedAt: article.datePosted?.toISOString() || new Date().toISOString(),
        category: article.category || 'Technology',
        sourceUrl: article.sourceUrl || '#',
        whyItMatters: article.whyItMatters || 'No additional context provided'
      };
    }
    
    console.log('❌ Article not found in MongoDB');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  }
  
  console.log('❌ Article not found in database');
  return null;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  console.log(`🎯 ArticlePage: Starting render for article ID: ${id}`);
  
  const article = await getArticle(id);
  
  if (!article) {
    console.log(`❌ ArticlePage: No article found for ID: ${id}, rendering custom 404`);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or may have been moved.</p>
          </div>
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  console.log(`✅ ArticlePage: Successfully found article: ${article.title}`);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Technology':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Startups':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Funding':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Machine Learning':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to News</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-semibold">AI News Hub</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Badge className={`${getCategoryColor(article.category)} border mb-4`}>
              {article.category}
            </Badge>
          </div>
          
          {/* Cover Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100">
            <Image
              src={(() => {
                const getTopicSpecificFallback = () => {
                  const category = article.category?.toLowerCase() || '';
                  const title = article.title?.toLowerCase() || '';
                  const excerpt = article.excerpt?.toLowerCase() || '';
                  
                  // AI and Machine Learning topics
                  if (category.includes('ai') || category.includes('machine learning') || 
                      title.includes('ai') || title.includes('genai') || title.includes('gemini') || 
                      excerpt.includes('artificial intelligence') || excerpt.includes('machine learning')) {
                    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  // E-commerce and Mobile apps
                  if (title.includes('ecommerce') || title.includes('app-based') || title.includes('mobile') ||
                      excerpt.includes('shopping') || excerpt.includes('ecommerce')) {
                    return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  // Data centers and cloud technology
                  if (title.includes('data center') || title.includes('cloud') || excerpt.includes('data center')) {
                    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  // iOS and Apple technology
                  if (title.includes('ios') || title.includes('apple') || excerpt.includes('ios')) {
                    return 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  // Nvidia and semiconductor/chips
                  if (title.includes('nvidia') || title.includes('chip') || title.includes('semiconductor') ||
                      title.includes('mellanox') || excerpt.includes('nvidia') || excerpt.includes('semiconductor') ||
                      excerpt.includes('mellanox') || excerpt.includes('antitrust')) {
                    return 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  // Sports technology
                  if (title.includes('football') || title.includes('sport') || excerpt.includes('sport')) {
                    return 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  // Writing and education technology
                  if (title.includes('writing') || title.includes('teacher') || title.includes('education') ||
                      excerpt.includes('writing') || excerpt.includes('education')) {
                    return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop&fm=jpg';
                  }
                  
                  return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&fm=jpg';
                };
                
                if (article.imageUrl === 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&fm=jpg' ||
                    article.imageUrl === 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&fm=jpg') {
                  return getTopicSpecificFallback();
                }
                
                return article.imageUrl || getTopicSpecificFallback();
              })()}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Metadata */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {article.publisherName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{article.publisherName}</p>
                      </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{article.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">AI-Generated Summary</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-base leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <p className="text-base leading-relaxed">
                  {article.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why It Matters */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why It Matters</h2>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <p className="text-base leading-relaxed text-foreground">
                {article.whyItMatters}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Read Original Button */}
        <div className="flex justify-center mb-12">
          <Button asChild size="lg" className="gap-2">
            <a 
              href={article.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4" />
              Read Original Article
            </a>
          </Button>
        </div>
      </main>

      {/* Note: AI Chatbot removed for server-side rendering */}
    </div>
  );
}
