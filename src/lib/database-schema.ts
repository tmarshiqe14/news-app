// MongoDB Native Schema Validation Definitions
// These schemas will be enforced at the database level

export const articlesCollectionSchema = {
  $jsonSchema: {
    bsonType: "object",
    title: "Articles Collection Schema",
    required: [
      "title",
      "coverImage", 
      "publisherName",
      "authorName",
      "datePosted",
      "quickSummary",
      "detailedSummary",
      "whyItMatters",
      "sourceUrl",
      "category",
      "createdAt",
      "updatedAt"
    ],
    properties: {
      title: {
        bsonType: "string",
        description: "Article title - required string",
        minLength: 10,
        maxLength: 500
      },
      coverImage: {
        bsonType: "string",
        description: "Article cover image URL - required string"
      },
      publisherName: {
        bsonType: "string",
        description: "Publisher name - required string",
        minLength: 2,
        maxLength: 100
      },
      publisherLogo: {
        bsonType: ["string", "null"],
        description: "Publisher logo URL - optional string"
      },
      authorName: {
        bsonType: "string",
        description: "Author name - required string",
        minLength: 2,
        maxLength: 100
      },
      datePosted: {
        bsonType: "date",
        description: "Article publication date - required date"
      },
      quickSummary: {
        bsonType: "string",
        description: "AI-generated quick summary - required string",
        minLength: 10,
        maxLength: 500
      },
      detailedSummary: {
        bsonType: "string",
        description: "AI-generated detailed summary - required string",
        minLength: 50,
        maxLength: 2000
      },
      whyItMatters: {
        bsonType: "string",
        description: "AI-generated why it matters section - required string",
        minLength: 20,
        maxLength: 1000
      },
      sourceUrl: {
        bsonType: "string",
        description: "Original article URL - required unique string"
      },
      category: {
        bsonType: "string",
        description: "Article category - required enum",
        enum: ["AI", "Technology", "Startups", "Funding", "Machine Learning"]
      },
      createdAt: {
        bsonType: "date",
        description: "Document creation timestamp - required date"
      },
      updatedAt: {
        bsonType: "date",
        description: "Document last update timestamp - required date"
      }
    },
    additionalProperties: false
  }
};

export const chatsCollectionSchema = {
  $jsonSchema: {
    bsonType: "object",
    title: "Chats Collection Schema",
    required: [
      "sessionId",
      "articleId", 
      "articleTitle",
      "messages",
      "createdAt",
      "updatedAt"
    ],
    properties: {
      sessionId: {
        bsonType: "string",
        description: "Unique chat session ID - required string",
        minLength: 10,
        maxLength: 100
      },
      articleId: {
        bsonType: "objectId",
        description: "Reference to article ObjectId - required ObjectId"
      },
      articleTitle: {
        bsonType: "string",
        description: "Article title for reference - required string",
        minLength: 10,
        maxLength: 500
      },
      messages: {
        bsonType: "array",
        description: "Array of chat messages - required array",
        minItems: 0,
        maxItems: 100,
        items: {
          bsonType: "object",
          required: ["text", "isUser", "timestamp"],
          properties: {
            text: {
              bsonType: "string",
              description: "Message text - required string",
              minLength: 1,
              maxLength: 2000
            },
            isUser: {
              bsonType: "bool",
              description: "Whether message is from user - required boolean"
            },
            timestamp: {
              bsonType: "date",
              description: "Message timestamp - required date"
            }
          },
          additionalProperties: false
        }
      },
      createdAt: {
        bsonType: "date",
        description: "Chat session creation timestamp - required date"
      },
      updatedAt: {
        bsonType: "date",
        description: "Chat session last update timestamp - required date"
      }
    },
    additionalProperties: false
  }
};

// Sample data templates
export const sampleArticle = {
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
  category: "AI",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const sampleChat = {
  sessionId: "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
  articleId: null, // Will be set to actual article ObjectId
  articleTitle: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
  messages: [
    {
      text: "What are the key improvements in GPT-5 compared to GPT-4?",
      isUser: true,
      timestamp: new Date("2024-01-15T11:00:00Z")
    },
    {
      text: "Based on the article, GPT-5 shows several key improvements over GPT-4: 1) Native multimodal processing for text, images, audio, and video, 2) 40% improvement in reasoning tasks, 3) 60% reduction in hallucinations, 4) Enhanced mathematical reasoning and coding capabilities, and 5) New safety measures and alignment techniques for responsible AI deployment.",
      isUser: false,
      timestamp: new Date("2024-01-15T11:00:05Z")
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};