const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixValidationLevel() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Set validation level to strict for both collections
    await db.command({
      collMod: 'articles',
      validationLevel: 'strict',
      validationAction: 'error'
    });
    console.log('✅ Set articles validation to strict');

    await db.command({
      collMod: 'chats', 
      validationLevel: 'strict',
      validationAction: 'error'
    });
    console.log('✅ Set chats validation to strict');

    await mongoose.connection.close();
    console.log('✅ Validation levels updated successfully');

  } catch (error) {
    console.error('❌ Failed to update validation:', error.message);
    process.exit(1);
  }
}

fixValidationLevel();
