const mongoose = require('mongoose');
require('dotenv').config();

const Attendance = require('./src/models/Attendance');

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://your-connection-string');
    
    console.log('✅ Connected successfully!');
    console.log('📝 Creating indexes...');
    
    // Create first index
    await Attendance.collection.createIndex({ student: 1, date: -1 });
    console.log('✅ Index 1 created: { student: 1, date: -1 }');
    
    // Create second index
    await Attendance.collection.createIndex({ student: 1, date: 1 });
    console.log('✅ Index 2 created: { student: 1, date: 1 }');
    
    console.log('\n🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
