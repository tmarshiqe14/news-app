# AI News Hub 
Project is hosted on GitHub. Screenshots included to demonstrate functionality; will be updated with a live deployment when hosting issues are resolved)
<img width="1511" height="868" alt="Screenshot 2025-09-16 at 3 58 49 PM" src="https://github.com/user-attachments/assets/f93a952c-5e5d-44d0-bd87-362a0f07c99f" />


A modern, responsive news web application built with Next.js, TypeScript, and shadcn/ui. Features AI-powered summaries, intelligent text truncation, and a beautiful, responsive design.

## Features


- **Responsive Design**: Fully responsive layout that adapts to any screen size
- **Modern UI**: Built with shadcn/ui components for a beautiful, consistent design
- **AI-Powered Summaries**: Intelligent article summaries and "Why It Matters" sections
- **Interactive Chatbot**: AI assistant for each article with contextual responses
- **Smart Text Truncation**: Intelligent text handling to maintain clean layouts
- **Category-Based Organization**: News organized by AI, Technology, Startups, Funding, and Machine Learning
- **High-Quality Images**: Optimized image loading with Next.js Image component
<img width="729" height="549" alt="Screenshot 2025-09-16 at 3 09 48 PM" src="https://github.com/user-attachments/assets/7c573c09-2b52-4e1e-a5c9-73919f6fc89e" />


## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component

## Getting Started

<img width="1512" height="901" alt="Screenshot 2025-09-16 at 3 59 17 PM" src="https://github.com/user-attachments/assets/fdd2e669-230c-4c3a-9fa0-684b042cc6c5" />

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd news-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── article/[id]/      # Dynamic article pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── AIChatbot.tsx     # AI chatbot component
│   └── NewsCard.tsx      # News card component
├── data/                 # Mock data
│   └── mockNews.ts       # Sample news articles
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
└── types/                # TypeScript types
    └── news.ts           # News article types
```

## Features Overview

### Main Page
- Displays 20 news cards in a responsive grid
- Each card shows cover image, title, summary, publisher, author, and date
- Intelligent text truncation for clean layouts
- Category badges with color coding

### Article Page
- Full article view with cover image and title
- Publisher metadata with logo
- AI-generated detailed summary (2 paragraphs)
- "Why It Matters" section for AI enthusiasts
- Link to original article source
- Interactive AI chatbot

### AI Chatbot
- Floating chat button on article pages
- Contextual responses based on article content
- Simulated AI responses (ready for API integration)
- Chat interface with message history

## Mock Data

The application currently uses comprehensive mock data with 20 news articles covering:
- AI developments and breakthroughs
- Technology innovations
- Startup funding and launches
- Machine learning research
- Industry funding rounds

Each article includes:
- High-quality cover images
- Realistic titles and summaries
- Publisher information with logos
- Author names and publication dates
- AI-generated content summaries
- "Why It Matters" explanations

## Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Optimized typography scaling
- Touch-friendly interactions
- Proper container spacing

## Phase Status

### ✅ Phase 1 - Frontend Complete
- Responsive news application with modern UI
- 20 news cards with mock data
- Article pages with AI summaries
- Interactive AI chatbot
- Fully responsive design

### ✅ Phase 2 - External Services Setup Complete
- MongoDB connection configured
- News API client ready
- Google Gemini API integrated
- Test endpoints and scripts created
- Next.js 15 compatibility ensured

### 🚧 Phase 3 - Backend Integration (Next)
- Real-time news fetching from News API
- Dynamic AI-generated summaries
- MongoDB database integration
- User authentication and preferences
- Advanced search and filtering
- Real-time updates and notifications

## Environment Setup

For Phase 2 and beyond, configure your environment variables in `.env.local`:

```bash
MONGODB_URI=your_mongodb_connection_string
NEWS_API_KEY=your_news_api_key
GOOGLE_API_KEY=your_gemini_api_key
```

Test your configuration:
```bash
npm run test:connections
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Image Configuration

The application is configured to load images from:
- Unsplash (images.unsplash.com)
- Lorem Picsum (picsum.photos)
- Placeholder (via.placeholder.com)

## License

This project is for demonstration purposes.
