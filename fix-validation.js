const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixValidation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Drop the existing validation rules
    try {
      await db.command({
        collMod: 'articles',
        validator: {},
        validationLevel: 'off'
      });
      console.log('✅ Disabled articles collection validation');
    } catch (error) {
      console.log('⚠️ Articles collection validation already disabled or not found');
    }

    try {
      await db.command({
        collMod: 'chats',
        validator: {},
        validationLevel: 'off'
      });
      console.log('✅ Disabled chats collection validation');
    } catch (error) {
      console.log('⚠️ Chats collection validation already disabled or not found');
    }

    await mongoose.connection.close();
    console.log('✅ Validation rules updated successfully');

  } catch (error) {
    console.error('❌ Failed to update validation:', error.message);
    process.exit(1);
  }
}

fixValidation();
