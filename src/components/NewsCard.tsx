import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2, ImageIcon } from 'lucide-react';

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

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text || typeof text !== 'string') return 'No content available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const getTopicSpecificFallback = () => {
    const category = article.category?.toLowerCase() || '';
    const title = article.title?.toLowerCase() || '';
    const excerpt = article.excerpt?.toLowerCase() || '';
    
    // AI and Machine Learning topics
    if (category.includes('ai') || category.includes('machine learning') || 
        title.includes('ai') || title.includes('genai') || title.includes('gemini') || 
        excerpt.includes('artificial intelligence') || excerpt.includes('machine learning')) {
      return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&fm=jpg'; // AI/Robot image
    }
    
    // E-commerce and Mobile apps
    if (title.includes('ecommerce') || title.includes('app-based') || title.includes('mobile') ||
        excerpt.includes('shopping') || excerpt.includes('ecommerce')) {
      return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&fm=jpg'; // Shopping/mobile image
    }
    
    // Data centers and cloud technology
    if (title.includes('data center') || title.includes('cloud') || excerpt.includes('data center')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&fm=jpg'; // Server/data center image
    }
    
    // iOS and Apple technology
    if (title.includes('ios') || title.includes('apple') || excerpt.includes('ios')) {
      return 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=400&fit=crop&fm=jpg'; // iPhone/Apple image
    }
    
    // Nvidia and semiconductor/chips
    if (title.includes('nvidia') || title.includes('chip') || title.includes('semiconductor') ||
        title.includes('mellanox') || excerpt.includes('nvidia') || excerpt.includes('semiconductor') ||
        excerpt.includes('mellanox') || excerpt.includes('antitrust')) {
      return 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop&fm=jpg'; // GPU/chip image
    }
    
    // Sports technology
    if (title.includes('football') || title.includes('sport') || excerpt.includes('sport')) {
      return 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop&fm=jpg'; // Sports image
    }
    
    // Writing and education technology
    if (title.includes('writing') || title.includes('teacher') || title.includes('education') ||
        excerpt.includes('writing') || excerpt.includes('education')) {
      return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop&fm=jpg'; // Writing/education image
    }
    
    // General technology fallback
    return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&fm=jpg';
  };

  const getImageSrc = () => {
    if (imageError) {
      return getTopicSpecificFallback();
    }
    
    // Check if the original URL is a generic fallback and replace with topic-specific
    if (article.imageUrl === 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&fm=jpg' ||
        article.imageUrl === 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&fm=jpg') {
      return getTopicSpecificFallback();
    }
    
    return article.imageUrl || getTopicSpecificFallback();
  };

  const handleImageError = () => {
    console.log(`Image failed to load: ${article.imageUrl}`);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Link href={`/article/${article.id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-pulse">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                    )}
                    <Image
                      src={getImageSrc()}
                      alt={article.title || 'News article image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      priority={false}
                    />
          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(article.category)} border`}>
              {article.category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {truncateText(article.title, 80)}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {truncateText(article.excerpt, 120)}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{article.publisherName}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{article.authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
