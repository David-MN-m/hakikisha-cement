const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        
        // Test each collection
        const collections = ['users', 'products', 'orders', 'verifications'];
        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection).countDocuments();
            console.log(`${collection} collection exists with ${count} documents`);
        }
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testConnection(); 