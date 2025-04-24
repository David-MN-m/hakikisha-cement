const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hakikisha_cement';

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB for seeding');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Sample products
        const sampleProducts = [
            {
                name: 'Bamburi Cement',
                description: 'High-quality cement for construction',
                price: 850,
                stock: 500
            },
            {
                name: 'Mombasa Cement',
                description: 'Durable cement for various construction needs',
                price: 800,
                stock: 300
            },
            {
                name: 'EAPC Cement',
                description: 'Reliable cement for building projects',
                price: 750,
                stock: 250
            }
        ];

        // Insert sample products
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log('Inserted sample products:', insertedProducts.length);

        // Close the connection
        await mongoose.connection.close();
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedProducts();
