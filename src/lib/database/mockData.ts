import { IArticle } from '../models/Article';
import { IChat, IMessage } from '../models/Chat';
import { Types } from 'mongoose';

// Mock articles data
export const mockArticles: Partial<IArticle>[] = [
  {
    title: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    publisherName: "TechCrunch",
    publisherLogo: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
    authorName: "Sarah Johnson",
    datePosted: new Date("2024-01-15T10:00:00Z"),
    quickSummary: "OpenAI has unveiled GPT-5, featuring groundbreaking multimodal capabilities that can process text, images, audio, and video simultaneously. The new model shows significant improvements in reasoning and factual accuracy.",
    detailedSummary: "OpenAI's latest language model, GPT-5, represents a major leap forward in artificial intelligence capabilities. The model introduces native multimodal processing, allowing it to understand and generate content across text, images, audio, and video formats seamlessly. Early benchmarks show a 40% improvement in reasoning tasks and a 60% reduction in hallucinations compared to GPT-4. The model also demonstrates enhanced mathematical reasoning and coding capabilities, making it particularly valuable for technical applications. OpenAI has implemented new safety measures and alignment techniques to ensure responsible AI deployment.",
    whyItMatters: "This advancement in AI technology could revolutionize how we interact with artificial intelligence systems. For AI enthusiasts and learners, GPT-5 represents a significant step toward artificial general intelligence (AGI). The multimodal capabilities open new possibilities for creative applications, educational tools, and productivity software. Understanding these developments is crucial for anyone working in AI, as they signal the direction of future innovations and the skills that will be most valuable in the evolving AI landscape.",
    sourceUrl: "https://techcrunch.com/2024/01/15/openai-announces-gpt5",
    category: "AI"
  },
  {
    title: "Anthropic Raises $2.75B in Series C to Accelerate AI Safety Research",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
    publisherName: "Forbes",
    publisherLogo: "https://www.forbes.com/favicon.ico",
    authorName: "Jennifer Liu",
    datePosted: new Date("2024-01-12T14:30:00Z"),
    quickSummary: "Anthropic secures massive funding round to expand AI safety research and develop more aligned AI systems. The investment will accelerate development of Constitutional AI and safety evaluation frameworks.",
    detailedSummary: "Anthropic, the AI safety company founded by former OpenAI researchers, has closed a $2.75 billion Series C funding round led by Google and other major investors. The funding will be used to advance the company's research into AI alignment and safety, particularly their Constitutional AI approach. This method trains AI systems to be helpful, harmless, and honest by using a set of principles to guide behavior. The company plans to expand their team of researchers and engineers while continuing to develop Claude, their AI assistant designed with safety as a primary concern.",
    whyItMatters: "As AI systems become more powerful, ensuring they remain safe and aligned with human values becomes increasingly critical. Anthropic's focus on AI safety research addresses one of the most important challenges in the field. For AI practitioners and enthusiasts, this investment signals growing recognition that safety research must keep pace with capability development. The techniques being developed at Anthropic could become industry standards for building trustworthy AI systems.",
    sourceUrl: "https://forbes.com/2024/01/12/anthropic-funding-round",
    category: "Funding"
  },
  {
    title: "Google DeepMind Achieves Breakthrough in Protein Folding Prediction",
    coverImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    publisherName: "Nature",
    publisherLogo: "https://www.nature.com/static/images/logos/nature-logo.svg",
    authorName: "Dr. Alex Thompson",
    datePosted: new Date("2024-01-11T09:15:00Z"),
    quickSummary: "DeepMind's AlphaFold3 achieves unprecedented accuracy in predicting protein structures and interactions, potentially revolutionizing drug discovery and biological research.",
    detailedSummary: "Google DeepMind has announced AlphaFold3, the latest iteration of their protein structure prediction system, which demonstrates remarkable improvements in accuracy and scope. The new model can predict not only protein structures but also protein-protein interactions, protein-DNA interactions, and protein-drug interactions with exceptional precision. This breakthrough builds on the success of AlphaFold2, which solved the 50-year-old protein folding problem. AlphaFold3 uses advanced transformer architectures and diffusion models to achieve its unprecedented accuracy, making it a powerful tool for understanding biological processes at the molecular level.",
    whyItMatters: "This breakthrough has profound implications for drug discovery, disease understanding, and biotechnology. Researchers can now predict how proteins interact with potential drugs, significantly accelerating the development of new treatments. For those interested in AI and biology, this represents a perfect example of how machine learning can solve fundamental scientific problems. The techniques developed for AlphaFold3 are also advancing the broader field of AI, particularly in areas like geometric deep learning and scientific computing.",
    sourceUrl: "https://nature.com/2024/01/11/alphafold3-breakthrough",
    category: "Machine Learning"
  },
  {
    title: "Microsoft Copilot Integration Transforms Office Productivity",
    coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    publisherName: "Wired",
    publisherLogo: "https://www.wired.com/favicon.ico",
    authorName: "Emily Watson",
    datePosted: new Date("2024-01-09T16:45:00Z"),
    quickSummary: "Microsoft's Copilot AI assistant shows 30% productivity gains in Office applications, revolutionizing how professionals work with documents, spreadsheets, and presentations.",
    detailedSummary: "Microsoft's integration of Copilot AI across the Office suite has demonstrated significant productivity improvements in enterprise environments. The AI assistant can generate documents, analyze data in Excel, create presentations, and manage emails with remarkable efficiency. Early adopters report a 30% reduction in time spent on routine tasks, allowing employees to focus on higher-value creative and strategic work. The system uses advanced language models fine-tuned specifically for productivity tasks, understanding context and user intent to provide relevant suggestions and automate repetitive processes.",
    whyItMatters: "This integration represents a fundamental shift in how we interact with productivity software. For professionals across all industries, AI-powered tools are becoming essential for maintaining competitive advantage. The success of Microsoft Copilot demonstrates the practical value of AI in everyday work environments, moving beyond experimental applications to real-world productivity gains. Understanding how to effectively use these tools will become a crucial skill in the modern workplace.",
    sourceUrl: "https://wired.com/2024/01/09/microsoft-copilot-productivity",
    category: "Technology"
  },
  {
    title: "Y Combinator's Latest Batch Features Record Number of AI Startups",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    publisherName: "TechCrunch",
    publisherLogo: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
    authorName: "David Park",
    datePosted: new Date("2024-01-10T11:20:00Z"),
    quickSummary: "Y Combinator's Winter 2024 batch includes 127 AI-focused startups, representing 60% of the cohort and highlighting the accelerating pace of AI entrepreneurship.",
    detailedSummary: "Y Combinator has revealed that their Winter 2024 batch contains a record-breaking 127 AI-focused startups, representing nearly 60% of the total cohort. These companies span various sectors including healthcare, education, finance, and developer tools, all leveraging artificial intelligence to solve complex problems. The startups range from companies building AI infrastructure and tools to those applying AI to specific industry challenges. Notable trends include the rise of AI agents, personalized AI tutors, and AI-powered creative tools. The accelerator has also noted increased interest from investors specifically seeking AI companies.",
    whyItMatters: "This surge in AI startups reflects the massive opportunity and disruption potential of artificial intelligence across industries. For entrepreneurs and investors, understanding these trends is crucial for identifying the next wave of successful companies. The diversity of applications shows that AI is not just a technology trend but a fundamental shift in how businesses operate. For those entering the AI field, studying these startups provides insights into market gaps and emerging opportunities.",
    sourceUrl: "https://techcrunch.com/2024/01/10/yc-ai-startups-record",
    category: "Startups"
  }
];

// Mock chat data generator
export const generateMockChat = (articleId: Types.ObjectId, articleTitle: string): Partial<IChat> => {
  const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const mockMessages: IMessage[] = [
    {
      text: "What are the key points discussed in this article?",
      isUser: true,
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      text: "Based on the article, the key points include the main technological breakthrough, its potential impact on the industry, and the implications for future development. The article also discusses the technical details and provides context about why this development is significant.",
      isUser: false,
      timestamp: new Date(Date.now() - 250000) // 4 minutes ago
    },
    {
      text: "How does this compare to similar developments in the field?",
      isUser: true,
      timestamp: new Date(Date.now() - 120000) // 2 minutes ago
    },
    {
      text: "This development represents a significant advancement compared to previous approaches. The key differentiators include improved accuracy, broader applicability, and better integration with existing systems. It builds upon earlier research while introducing novel techniques that address previous limitations.",
      isUser: false,
      timestamp: new Date(Date.now() - 60000) // 1 minute ago
    }
  ];

  return {
    sessionId,
    articleId,
    articleTitle,
    messages: mockMessages
  };
};

// Function to create multiple mock chats for different articles
export const generateMockChats = (articles: any[]): Partial<IChat>[] => {
  return articles.map(article => 
    generateMockChat(article._id, article.title)
  );
};
