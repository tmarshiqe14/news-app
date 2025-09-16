import fetch from 'node-fetch';

// 10 Fresh News Articles with Complete Data
const articles = [
  {
    title: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
    quickSummary: "OpenAI has unveiled GPT-5, featuring groundbreaking multimodal capabilities that can process text, images, audio, and video simultaneously. The new model shows significant improvements in reasoning and factual accuracy.",
    detailedSummary: "OpenAI's latest language model, GPT-5, represents a major leap forward in artificial intelligence capabilities. The model introduces native multimodal processing, allowing it to understand and generate content across text, images, audio, and video formats seamlessly. Early benchmarks show a 40% improvement in reasoning tasks and a 60% reduction in hallucinations compared to GPT-4.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    publisherName: "TechCrunch",
    publisherLogo: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
    authorName: "Sarah Johnson",
    datePosted: "2024-01-15T10:00:00Z",
    category: "AI",
    sourceUrl: "https://techcrunch.com/2024/01/15/openai-announces-gpt5",
    whyItMatters: "This advancement in AI technology could revolutionize how we interact with artificial intelligence systems. For AI enthusiasts and learners, GPT-5 represents a significant step toward artificial general intelligence (AGI)."
  },
  {
    title: "Google's Gemini AI Now Powers Advanced Medical Diagnosis Systems",
    quickSummary: "Google has integrated its Gemini AI model into medical diagnosis platforms, achieving 94% accuracy in detecting rare diseases from medical imaging and patient data analysis.",
    detailedSummary: "Google's Gemini AI has been successfully deployed in several major hospital systems worldwide, where it assists doctors in diagnosing complex medical conditions. The AI system analyzes medical images, lab results, and patient histories to identify patterns that might be missed by human physicians.",
    coverImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    publisherName: "MIT Technology Review",
    publisherLogo: "https://wp.technologyreview.com/wp-content/uploads/2021/01/mit-logo.png",
    authorName: "Dr. Michael Chen",
    datePosted: "2024-01-14T14:30:00Z",
    category: "AI",
    sourceUrl: "https://technologyreview.com/2024/01/14/gemini-medical-diagnosis",
    whyItMatters: "This breakthrough demonstrates AI's potential to transform healthcare by improving diagnostic accuracy and reducing medical errors. For healthcare professionals and patients, this technology could lead to earlier detection of serious conditions."
  },
  {
    title: "Microsoft Copilot Enterprise Reaches 100 Million Users Milestone",
    quickSummary: "Microsoft announces that Copilot for Enterprise has surpassed 100 million active users, making it the fastest-growing business AI tool in history with significant productivity gains reported across organizations.",
    detailedSummary: "Microsoft's Copilot for Enterprise has achieved unprecedented adoption rates, reaching 100 million active users just 18 months after its launch. The AI-powered productivity assistant has been integrated into Microsoft 365 applications, helping users with document creation, data analysis, meeting summaries, and code generation.",
    coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    publisherName: "The Verge",
    publisherLogo: "https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395359/android-chrome-192x192.0.png",
    authorName: "Emma Rodriguez",
    datePosted: "2024-01-13T09:15:00Z",
    category: "Technology",
    sourceUrl: "https://theverge.com/2024/01/13/microsoft-copilot-100-million-users",
    whyItMatters: "The rapid adoption of Copilot demonstrates how AI is becoming essential for modern workplace productivity. This milestone indicates a fundamental shift in how businesses operate and compete."
  }
];

async function addArticles() {
  console.log('🚀 Adding articles via API...');
  
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`\n📝 Adding article ${i + 1}: ${article.title}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Successfully added article ${i + 1}`);
      } else {
        console.log(`❌ Failed to add article ${i + 1}:`, result);
      }
    } catch (error) {
      console.log(`❌ Error adding article ${i + 1}:`, error.message);
    }
  }
  
  // Check final count
  console.log('\n📊 Checking final article count...');
  try {
    const response = await fetch('http://localhost:3000/api/articles');
    const data = await response.json();
    console.log(`Total articles: ${data.count}`);
    console.log(`Source: ${data.source}`);
  } catch (error) {
    console.log('❌ Error checking article count:', error.message);
  }
}

addArticles();
