const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config(); // Load environment variables from .env file

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Log the MongoDB URI to verify
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the JWT secret to verify

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create sample vendor
        const vendorPassword = await bcrypt.hash('vendor123', 10);
        const vendor = await User.create({
            role: 'vendor',
            businessName: 'Simba Cement Ltd',
            email: 'vendor@example.com',
            password: vendorPassword,
            phone: '+254700000000',
            address: 'Nairobi, Kenya',
            first_name: 'Vendor',
            last_name: 'Example'
        });

        // Create sample customer
        const customerPassword = await bcrypt.hash('customer123', 10);
        await User.create({
            role: 'customer',
            name: 'John Doe',
            email: 'customer@example.com',
            password: customerPassword,
            phone: '+254711111111',
            address: 'Mombasa, Kenya',
            first_name: 'John',
            last_name: 'Doe'
        });

        // Create sample products
        await Product.create([
            {
                vendorId: vendor._id,
                name: 'Simba Cement Portland',
                description: 'High-quality Portland cement',
                brand: 'Simba Cement',
                type: 'Portland Cement',
                price: 750,
                stock: 1000,
                verificationCode: 'SIM001'
            },
            {
                vendorId: vendor._id,
                name: 'Simba Cement Rapid Hardening',
                description: 'Rapid hardening cement for quick construction',
                brand: 'Simba Cement',
                type: 'Rapid Hardening',
                price: 800,
                stock: 500,
                verificationCode: 'SIM002'
            }
        ]);

        console.log('Sample data created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();