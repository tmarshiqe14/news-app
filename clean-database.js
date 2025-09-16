const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function cleanInvalidData() {
  try {
    console.log('🧹 CLEANING INVALID DATABASE ENTRIES');
    console.log('====================================');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('articles');

    // Remove articles with invalid data
    const deleteResult = await collection.deleteMany({
      $or: [
        { title: { $in: ['Short', ''] } },
        { title: { $regex: /^.{1,5}$/ } }, // Very short titles
        { coverImage: { $regex: /^(not-a-valid-url|invalid-url)$/i } },
        { sourceUrl: { $regex: /^(invalid-url|not-a-valid-url)$/i } },
        { category: 'InvalidCategory' },
        { quickSummary: { $regex: /^.{1,10}$/ } }, // Very short summaries
        { detailedSummary: { $regex: /^.{1,15}$/ } } // Very short detailed summaries
      ]
    });

    console.log(`✅ Removed ${deleteResult.deletedCount} invalid articles`);

    // Count remaining articles
    const remainingCount = await collection.countDocuments();
    console.log(`📊 Remaining articles: ${remainingCount}`);

    await mongoose.connection.close();
    console.log('✅ Database cleanup completed successfully');

  } catch (error) {
    console.error('❌ Failed to clean database:', error.message);
    process.exit(1);
  }
}

cleanInvalidData();
