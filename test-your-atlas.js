// Test Your MongoDB Atlas Connection
import mongoose from 'mongoose';

const ATLAS_CONNECTION_STRING = 'mongodb+srv://harishpblr2007_db_user:YOUR_PASSWORD@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0';

console.log('🧪 Testing Your MongoDB Atlas Connection...');
console.log('==========================================');

if (ATLAS_CONNECTION_STRING.includes('<db_password>')) {
    console.log('❌ Please replace <db_password> with your actual database password');
    console.log('📝 Your connection string should look like:');
    console.log('mongodb+srv://harishpblr2007_db_user:YOUR_ACTUAL_PASSWORD@cluster0.yaga33w.mongodb.net/edutrack?appName=Cluster0');
    process.exit(1);
}

async function testConnection() {
    try {
        await mongoose.connect(ATLAS_CONNECTION_STRING);
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        const db = mongoose.connection.db;
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name));
        
        // Check students count
        const studentsCount = await db.collection('students').countDocuments();
        console.log(`👥 Students in database: ${studentsCount}`);
        
        if (studentsCount === 0) {
            console.log('📥 Database is empty. Ready to import student data!');
        }
        
        await mongoose.disconnect();
        console.log('🔌 Disconnected successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('💡 Possible solutions:');
        console.log('   1. Check if you added IP access (0.0.0.0/0)');
        console.log('   2. Verify your password is correct');
        console.log('   3. Ensure cluster is resumed');
        console.log('   4. Check if username is correct');
    }
}

testConnection();
