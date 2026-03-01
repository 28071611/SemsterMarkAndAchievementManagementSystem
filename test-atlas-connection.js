// Test MongoDB Atlas Connection
import mongoose from 'mongoose';
import { testAtlasConnection } from './setup-atlas-connection.js';

// Replace this with your actual Atlas connection string
const ATLAS_CONNECTION_STRING = 'mongodb+srv://edutrack-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/edutrack?retryWrites=true&w=majority';

console.log('🧪 Testing MongoDB Atlas Connection...');
console.log('=====================================');

if (ATLAS_CONNECTION_STRING.includes('YOUR_PASSWORD')) {
    console.log('❌ Please update the connection string in test-atlas-connection.js');
    console.log('📝 Get your connection string from MongoDB Atlas console');
    process.exit(1);
}

testAtlasConnection(ATLAS_CONNECTION_STRING);
