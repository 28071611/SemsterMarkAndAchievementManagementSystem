// MongoDB Atlas Connection Setup Script
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Atlas Configuration Template
const atlasConfig = {
    MONGO_URI: 'mongodb+srv://edutrack-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/edutrack?retryWrites=true&w=majority',
    NODE_ENV: 'production',
    PORT: 5000
};

console.log('🌍 MongoDB Atlas Setup for EduTrack');
console.log('=====================================\n');

console.log('Steps to complete:');
console.log('1. Resume your cluster in MongoDB Atlas');
console.log('2. Get your connection string');
console.log('3. Create database user "edutrack-admin"');
console.log('4. Add IP access: 0.0.0.0/0');
console.log('5. Update connection string below\n');

console.log('Connection String Format:');
console.log('mongodb+srv://edutrack-admin:PASSWORD@cluster0.xxxxx.mongodb.net/edutrack?retryWrites=true&w=majority\n');

console.log('Replace with your actual connection string and test with:');
console.log('node test-atlas-connection.js\n');

// Test connection function
async function testAtlasConnection(connectionString) {
    try {
        await mongoose.connect(connectionString);
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        // Test database operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log(`📊 Found ${collections.length} collections`);
        
        // Import students if empty
        const studentsCount = await db.collection('students').countDocuments();
        if (studentsCount === 0) {
            console.log('📥 No students found. Run import script:');
            console.log('   MONGO_URI="' + connectionString + '" node import_students.js');
        } else {
            console.log(`👥 Found ${studentsCount} students in Atlas`);
        }
        
        await mongoose.disconnect();
        console.log('🔌 Disconnected from Atlas');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        await mongoose.disconnect();
    }
}

export { testAtlasConnection };
