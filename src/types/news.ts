export interface NewsArticle {
  id: string;
  title: string;
  coverImage: string;
  publisher: {
    name: string;
    logo: string;
  };
  author: string;
  publicationDate: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning';
  summary: string;
  detailedSummary: string;
  whyItMatters: string;
  originalUrl: string;
  content?: string;
}
