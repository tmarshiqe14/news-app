import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  quickSummary: { type: String, required: true },
  detailedSummary: { type: String, required: true },
  coverImage: { type: String, required: true },
  publisherName: { type: String, required: true },
  publisherLogo: { type: String, default: null },
  authorName: { type: String, required: true },
  datePosted: { type: Date, required: true },
  category: { type: String, required: true },
  sourceUrl: { type: String, required: true },
  whyItMatters: { type: String, required: true }
}, {
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

// 10 Fresh News Articles with Complete Data
const articles = [
  {
    title: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
    quickSummary: "OpenAI has unveiled GPT-5, featuring groundbreaking multimodal capabilities that can process text, images, audio, and video simultaneously. The new model shows significant improvements in reasoning and factual accuracy.",
    detailedSummary: "OpenAI's latest language model, GPT-5, represents a major leap forward in artificial intelligence capabilities. The model introduces native multimodal processing, allowing it to understand and generate content across text, images, audio, and video formats seamlessly. Early benchmarks show a 40% improvement in reasoning tasks and a 60% reduction in hallucinations compared to GPT-4. The model also demonstrates enhanced mathematical reasoning and coding capabilities, making it particularly valuable for technical applications. OpenAI has implemented new safety measures and alignment techniques to ensure responsible AI deployment.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    publisherName: "TechCrunch",
    publisherLogo: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
    authorName: "Sarah Johnson",
    datePosted: new Date('2024-01-15T10:00:00Z'),
    category: "AI",
    sourceUrl: "https://techcrunch.com/2024/01/15/openai-announces-gpt5",
    whyItMatters: "This advancement in AI technology could revolutionize how we interact with artificial intelligence systems. For AI enthusiasts and learners, GPT-5 represents a significant step toward artificial general intelligence (AGI). The multimodal capabilities open new possibilities for creative applications, educational tools, and productivity software. Understanding these developments is crucial for anyone working in AI, as they signal the direction of future innovations and the skills that will be most valuable in the evolving AI landscape."
  },
  {
    title: "Google's Gemini AI Now Powers Advanced Medical Diagnosis Systems",
    quickSummary: "Google has integrated its Gemini AI model into medical diagnosis platforms, achieving 94% accuracy in detecting rare diseases from medical imaging and patient data analysis.",
    detailedSummary: "Google's Gemini AI has been successfully deployed in several major hospital systems worldwide, where it assists doctors in diagnosing complex medical conditions. The AI system analyzes medical images, lab results, and patient histories to identify patterns that might be missed by human physicians. In clinical trials, Gemini showed remarkable performance in detecting rare genetic disorders, early-stage cancers, and neurological conditions. The system has been particularly effective in radiology, where it can identify subtle abnormalities in X-rays, MRIs, and CT scans. Google has worked closely with medical professionals to ensure the AI serves as a diagnostic aid rather than a replacement for human expertise.",
    coverImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    publisherName: "MIT Technology Review",
    publisherLogo: "https://wp.technologyreview.com/wp-content/uploads/2021/01/mit-logo.png",
    authorName: "Dr. Michael Chen",
    datePosted: new Date('2024-01-14T14:30:00Z'),
    category: "AI",
    sourceUrl: "https://technologyreview.com/2024/01/14/gemini-medical-diagnosis",
    whyItMatters: "This breakthrough demonstrates AI's potential to transform healthcare by improving diagnostic accuracy and reducing medical errors. For healthcare professionals and patients, this technology could lead to earlier detection of serious conditions and more personalized treatment plans. The success of Gemini in medical applications also highlights the importance of responsible AI development in critical sectors, setting new standards for AI safety and reliability in healthcare."
  },
  {
    title: "Microsoft Copilot Enterprise Reaches 100 Million Users Milestone",
    quickSummary: "Microsoft announces that Copilot for Enterprise has surpassed 100 million active users, making it the fastest-growing business AI tool in history with significant productivity gains reported across organizations.",
    detailedSummary: "Microsoft's Copilot for Enterprise has achieved unprecedented adoption rates, reaching 100 million active users just 18 months after its launch. The AI-powered productivity assistant has been integrated into Microsoft 365 applications, helping users with document creation, data analysis, meeting summaries, and code generation. Companies using Copilot report an average 30% increase in productivity and 25% reduction in time spent on routine tasks. The platform has been particularly successful in automating report generation, email drafting, and presentation creation. Microsoft has also introduced new features including advanced data visualization, multi-language support, and enhanced security controls for enterprise environments.",
    coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    publisherName: "The Verge",
    publisherLogo: "https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395359/android-chrome-192x192.0.png",
    authorName: "Emma Rodriguez",
    datePosted: new Date('2024-01-13T09:15:00Z'),
    category: "Technology",
    sourceUrl: "https://theverge.com/2024/01/13/microsoft-copilot-100-million-users",
    whyItMatters: "The rapid adoption of Copilot demonstrates how AI is becoming essential for modern workplace productivity. This milestone indicates a fundamental shift in how businesses operate and compete. For professionals and organizations, understanding and leveraging AI tools like Copilot is becoming crucial for maintaining competitive advantage. The success also validates the integration approach of embedding AI into existing workflows rather than creating standalone applications."
  },
  {
    title: "Tesla's FSD Beta Achieves Level 4 Autonomy in Urban Environments",
    quickSummary: "Tesla's Full Self-Driving (FSD) Beta has successfully demonstrated Level 4 autonomous driving capabilities in complex urban scenarios, with the system handling intersections, pedestrians, and unexpected obstacles without human intervention.",
    detailedSummary: "Tesla's latest FSD Beta version 12.3 has achieved a significant milestone by demonstrating Level 4 autonomous driving capabilities in challenging urban environments. The system successfully navigated complex scenarios including unmarked intersections, construction zones, emergency vehicles, and unpredictable pedestrian behavior. During extensive testing across 50 cities, the FSD system maintained a 99.7% safety record while handling over 10,000 hours of autonomous driving. The breakthrough comes from Tesla's neural network improvements and the integration of real-time data from its global fleet of vehicles. The system now processes visual data 40% faster and makes more human-like driving decisions in ambiguous situations.",
    coverImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=400&fit=crop",
    publisherName: "Electrek",
    publisherLogo: "https://electrek.co/wp-content/uploads/sites/3/2016/05/cropped-electrek-favicon-512.png",
    authorName: "Alex Thompson",
    datePosted: new Date('2024-01-12T16:45:00Z'),
    category: "Technology",
    sourceUrl: "https://electrek.co/2024/01/12/tesla-fsd-level-4-autonomy",
    whyItMatters: "This advancement brings fully autonomous vehicles closer to reality, potentially transforming transportation, logistics, and urban planning. For consumers and the automotive industry, Level 4 autonomy represents a critical threshold where vehicles can operate without human oversight in most conditions. This development also has significant implications for ride-sharing services, delivery companies, and public transportation systems."
  },
  {
    title: "Meta Unveils Next-Generation VR Headset with Neural Interface Technology",
    quickSummary: "Meta has announced the Quest Pro 2, featuring revolutionary neural interface technology that allows users to control virtual environments using thought patterns, marking a major breakthrough in brain-computer interfaces.",
    detailedSummary: "Meta's Quest Pro 2 represents a quantum leap in virtual reality technology with the introduction of non-invasive neural interface capabilities. The headset uses advanced EEG sensors and machine learning algorithms to interpret brain signals, allowing users to navigate virtual environments, select objects, and interact with digital content through thought alone. The system learns individual user patterns over time, improving accuracy and responsiveness. Early testing shows users can achieve 85% accuracy in thought-based controls after just one hour of training. The device also features 8K resolution per eye, haptic feedback systems, and a lightweight design that reduces fatigue during extended use.",
    coverImage: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=400&fit=crop",
    publisherName: "Ars Technica",
    publisherLogo: "https://cdn.arstechnica.net/wp-content/themes/ars/assets/img/ars-logo-512.png",
    authorName: "Jennifer Park",
    datePosted: new Date('2024-01-11T11:20:00Z'),
    category: "Technology",
    sourceUrl: "https://arstechnica.com/2024/01/11/meta-quest-pro-2-neural-interface",
    whyItMatters: "This breakthrough in brain-computer interfaces opens new possibilities for human-computer interaction and accessibility technology. For individuals with mobility limitations, neural interfaces could provide unprecedented control over digital environments. The technology also has implications for gaming, education, and professional training, potentially creating more intuitive and immersive experiences."
  },
  {
    title: "Anthropic's Claude 3.5 Achieves Breakthrough in Scientific Research Automation",
    quickSummary: "Anthropic's Claude 3.5 has successfully automated complex scientific research processes, independently conducting literature reviews, hypothesis generation, and experimental design across multiple disciplines.",
    detailedSummary: "Anthropic's latest AI model, Claude 3.5, has demonstrated unprecedented capabilities in scientific research automation. The system can independently conduct comprehensive literature reviews across multiple scientific databases, identify research gaps, generate testable hypotheses, and design experimental protocols. In collaboration with leading universities, Claude 3.5 has contributed to breakthrough discoveries in materials science, drug discovery, and climate modeling. The AI has processed over 50 million scientific papers and identified novel connections between seemingly unrelated research areas. Researchers report that Claude 3.5 can complete literature reviews that would typically take weeks in just a few hours, while maintaining high accuracy and identifying relevant papers that human researchers might miss.",
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
    publisherName: "Nature",
    publisherLogo: "https://media.springernature.com/full/nature-cms/uploads/product/nature/header-86a7d5808746b9a54315a1b2a0c9b8f5.svg",
    authorName: "Dr. Lisa Wang",
    datePosted: new Date('2024-01-10T08:30:00Z'),
    category: "AI",
    sourceUrl: "https://nature.com/2024/01/10/claude-scientific-research-automation",
    whyItMatters: "This development could accelerate scientific discovery by automating time-consuming research processes and identifying novel research directions. For researchers and academic institutions, AI-assisted research could lead to faster breakthroughs and more efficient use of research resources. The technology also democratizes access to comprehensive literature reviews and research planning, potentially leveling the playing field for researchers at smaller institutions."
  },
  {
    title: "Apple Vision Pro 2 Introduces Revolutionary Spatial Computing Features",
    quickSummary: "Apple's second-generation Vision Pro headset features advanced spatial computing capabilities, including real-time 3D environment mapping and seamless integration with the Apple ecosystem for professional workflows.",
    detailedSummary: "The Apple Vision Pro 2 builds upon its predecessor with significant improvements in spatial computing technology. The new device features enhanced LiDAR sensors and computer vision algorithms that create detailed 3D maps of physical environments in real-time. Users can now place virtual objects in their physical space with millimeter precision, and these objects persist across sessions. The device integrates seamlessly with Mac, iPhone, and iPad, allowing users to extend their workflows into three-dimensional space. Professional applications include architectural visualization, medical training, and collaborative design sessions where multiple users can interact with the same virtual objects simultaneously.",
    coverImage: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop",
    publisherName: "MacRumors",
    publisherLogo: "https://images.macrumors.com/images-new/mrlogo2023.png",
    authorName: "David Kim",
    datePosted: new Date('2024-01-09T13:15:00Z'),
    category: "Technology",
    sourceUrl: "https://macrumors.com/2024/01/09/apple-vision-pro-2-spatial-computing",
    whyItMatters: "Apple's advancement in spatial computing could redefine how we interact with digital content and collaborate in professional environments. For designers, architects, and educators, this technology offers new ways to visualize and manipulate 3D content. The seamless ecosystem integration also demonstrates how mixed reality can become a natural extension of existing workflows rather than a separate computing paradigm."
  },
  {
    title: "NVIDIA's H200 AI Chip Delivers 50% Performance Boost for Large Language Models",
    quickSummary: "NVIDIA has launched the H200 Tensor Core GPU, specifically designed for AI workloads, delivering unprecedented performance improvements for training and inference of large language models.",
    detailedSummary: "NVIDIA's H200 Tensor Core GPU represents a major advancement in AI computing hardware, offering up to 50% better performance compared to the previous generation H100 chips. The H200 features 141GB of HBM3e memory with 4.8TB/s of memory bandwidth, specifically optimized for large language model training and inference. The chip includes new Transformer Engine capabilities that accelerate attention mechanisms and support for 8-bit floating-point formats that maintain model accuracy while reducing memory usage. Major cloud providers including AWS, Google Cloud, and Microsoft Azure have already begun deploying H200-based instances. The chip enables training of models with over 1 trillion parameters and supports real-time inference for complex AI applications.",
    coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
    publisherName: "Tom's Hardware",
    publisherLogo: "https://cdn.mos.cms.futurecdn.net/themes/toms-hardware/assets/images/toms-hardware-logo.svg",
    authorName: "Marcus Johnson",
    datePosted: new Date('2024-01-08T10:45:00Z'),
    category: "Technology",
    sourceUrl: "https://tomshardware.com/2024/01/08/nvidia-h200-ai-chip-performance",
    whyItMatters: "The H200's performance improvements make advanced AI capabilities more accessible to a broader range of organizations and researchers. This hardware advancement enables more sophisticated AI applications and reduces the computational costs of running large language models. For the AI industry, improved hardware efficiency directly translates to faster innovation cycles and more practical deployment of AI solutions."
  },
  {
    title: "Quantum Computing Startup Achieves 1000-Qubit Milestone with Error Correction",
    quickSummary: "IonQ has successfully demonstrated a 1000-qubit quantum computer with advanced error correction, marking a significant step toward practical quantum computing applications.",
    detailedSummary: "IonQ's breakthrough 1000-qubit quantum computer represents a major milestone in quantum computing development. The system uses trapped-ion technology with advanced quantum error correction algorithms that maintain coherence across all qubits simultaneously. This achievement enables the execution of complex quantum algorithms that were previously impossible due to error accumulation. The system has successfully demonstrated quantum advantage in optimization problems, cryptographic applications, and molecular simulation. IonQ's approach uses individual laser-controlled ions as qubits, providing superior coherence times and gate fidelities compared to other quantum computing technologies. The company has partnered with pharmaceutical companies to accelerate drug discovery through quantum-enhanced molecular modeling.",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
    publisherName: "IEEE Spectrum",
    publisherLogo: "https://spectrum.ieee.org/media/img/ieee-spectrum-logo.png",
    authorName: "Dr. Rachel Foster",
    datePosted: new Date('2024-01-07T15:20:00Z'),
    category: "Technology",
    sourceUrl: "https://spectrum.ieee.org/2024/01/07/ionq-1000-qubit-quantum-computer",
    whyItMatters: "This quantum computing milestone brings us closer to solving complex problems that are intractable for classical computers. For industries like pharmaceuticals, finance, and logistics, quantum computing could revolutionize optimization and simulation tasks. The achievement also has significant implications for cybersecurity, as large-scale quantum computers could potentially break current encryption methods."
  },
  {
    title: "SpaceX Starship Completes First Commercial Mars Cargo Mission",
    quickSummary: "SpaceX has successfully completed its first commercial cargo delivery to Mars, transporting scientific equipment and supplies for the upcoming human missions planned for 2026.",
    detailedSummary: "SpaceX's Starship has achieved a historic milestone by completing the first commercial cargo mission to Mars, delivering 150 tons of scientific equipment, life support systems, and supplies to the Martian surface. The mission included advanced rovers, atmospheric processors, and habitat modules that will support future human missions. The Starship utilized SpaceX's new Raptor 3 engines and demonstrated successful in-orbit refueling using multiple Starship tanker flights. The cargo was delivered to the Chryse Planitia landing site, where it will establish the foundation for a permanent research base. This mission validates SpaceX's Mars transportation architecture and demonstrates the feasibility of large-scale cargo delivery to the Red Planet.",
    coverImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop",
    publisherName: "Space News",
    publisherLogo: "https://spacenews.com/wp-content/uploads/2021/01/SpaceNews-logo-2021.png",
    authorName: "Captain Maria Santos",
    datePosted: new Date('2024-01-06T12:00:00Z'),
    category: "Technology",
    sourceUrl: "https://spacenews.com/2024/01/06/spacex-starship-mars-cargo-mission",
    whyItMatters: "This successful Mars cargo mission represents a crucial step toward establishing a sustainable human presence on Mars. For space exploration and colonization efforts, this demonstrates the viability of using Mars as a stepping stone for deeper space exploration. The mission also validates commercial space transportation for interplanetary missions, opening new possibilities for scientific research and resource utilization beyond Earth."
  }
];

async function populateDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing articles
    console.log('🧹 Clearing existing articles...');
    await Article.deleteMany({});

    // Insert new articles
    console.log('📝 Inserting 10 fresh articles...');
    const insertedArticles = await Article.insertMany(articles);
    
    console.log(`✅ Successfully inserted ${insertedArticles.length} articles`);
    
    // Verify the data
    const count = await Article.countDocuments();
    console.log(`📊 Total articles in database: ${count}`);
    
    // Display summary
    console.log('\n📋 Articles Summary:');
    const articleSummary = await Article.find({}, 'title publisherName category datePosted').sort({ datePosted: -1 });
    articleSummary.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - ${article.publisherName} (${article.category})`);
    });

    console.log('\n🎯 Database population complete!');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

populateDatabase();

