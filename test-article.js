const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testArticleCreation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define a simple schema without strict validation for testing
    const testSchema = new mongoose.Schema({
      title: String,
      coverImage: String,
      publisherName: String,
      authorName: String,
      datePosted: Date,
      quickSummary: String,
      detailedSummary: String,
      whyItMatters: String,
      sourceUrl: String,
      category: String,
      createdAt: Date,
      updatedAt: Date
    }, { collection: 'articles' });

    const TestArticle = mongoose.model('TestArticle', testSchema);

    const testArticle = {
      title: "Test Article: AI Breakthrough in Natural Language Processing",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      publisherName: "AI Research Today",
      authorName: "Dr. Jane Smith",
      datePosted: new Date(),
      quickSummary: "A comprehensive look at the latest breakthroughs in natural language processing, highlighting key innovations and their potential impact on the field.",
      detailedSummary: "Recent advancements in natural language processing have opened new possibilities for human-computer interaction. This article explores the technical details of transformer architectures, attention mechanisms, and their applications in real-world scenarios. The research demonstrates significant improvements in language understanding and generation capabilities.",
      whyItMatters: "These developments in NLP technology represent a significant step forward for AI practitioners and enthusiasts. Understanding these innovations is crucial for anyone working in the field of artificial intelligence.",
      sourceUrl: "https://example.com/test-article-" + Date.now(),
      category: "AI",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const savedArticle = await TestArticle.create(testArticle);
    console.log('✅ Article saved successfully:', savedArticle._id);

    // Clean up
    await TestArticle.findByIdAndDelete(savedArticle._id);
    console.log('✅ Test article cleaned up');

    await mongoose.connection.close();
    console.log('✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testArticleCreation();
