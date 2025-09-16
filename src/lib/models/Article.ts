import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for Article
export interface IArticle extends Document {
  title: string;
  coverImage: string;
  publisherName: string;
  publisherLogo?: string;
  authorName: string;
  datePosted: Date;
  quickSummary: string;
  detailedSummary: string;
  whyItMatters: string;
  sourceUrl: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning';
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Article
const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [500, 'Title cannot exceed 500 characters'],
    trim: true
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
    match: [/^https?:\/\/.*/, 'Please provide a valid URL']
  },
  publisherName: {
    type: String,
    required: [true, 'Publisher name is required'],
    minlength: [2, 'Publisher name must be at least 2 characters'],
    maxlength: [100, 'Publisher name cannot exceed 100 characters'],
    trim: true
  },
  publisherLogo: {
    type: String,
    required: false,
    match: [/^https?:\/\/.*/, 'Please provide a valid URL']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    minlength: [2, 'Author name must be at least 2 characters'],
    maxlength: [100, 'Author name cannot exceed 100 characters'],
    trim: true
  },
  datePosted: {
    type: Date,
    required: [true, 'Date posted is required']
  },
  quickSummary: {
    type: String,
    required: [true, 'Quick summary is required'],
    minlength: [50, 'Quick summary must be at least 50 characters'],
    maxlength: [500, 'Quick summary cannot exceed 500 characters'],
    trim: true
  },
  detailedSummary: {
    type: String,
    required: [true, 'Detailed summary is required'],
    minlength: [100, 'Detailed summary must be at least 100 characters'],
    maxlength: [2000, 'Detailed summary cannot exceed 2000 characters'],
    trim: true
  },
  whyItMatters: {
    type: String,
    required: [true, 'Why it matters section is required'],
    minlength: [50, 'Why it matters must be at least 50 characters'],
    maxlength: [1000, 'Why it matters cannot exceed 1000 characters'],
    trim: true
  },
  sourceUrl: {
    type: String,
    required: [true, 'Source URL is required'],
    match: [/^https?:\/\/.*/, 'Please provide a valid URL']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'],
      message: 'Category must be one of: AI, Technology, Startups, Funding, Machine Learning'
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'articles'
});

// Create indexes for better performance
ArticleSchema.index({ sourceUrl: 1 }, { unique: true });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ datePosted: -1 });
ArticleSchema.index({ createdAt: -1 });

// Export the model
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
