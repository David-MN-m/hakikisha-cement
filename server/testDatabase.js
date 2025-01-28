require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Verification = require('./models/Verification');

async function testDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Test each collection
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nExisting collections:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });

        // Test creating a vendor
        const testVendor = new Vendor({
            name: "Test Vendor",
            email: "test@vendor.com",
            password: "hashedpassword",
            company: "Test Company",
            location: "Nairobi",
            businessType: "manufacturer"
        });

        await testVendor.save();
        console.log('\nTest vendor created successfully');

        // Test creating a product
        const testProduct = new Product({
            name: "Test Cement",
            cementType: "Ordinary Portland Cement (OPC)",
            grade: "42.5",
            manufacturer: testVendor._id,
            strength: "High",
            price: 750,
            packagingSize: 50
        });

        await testProduct.save();
        console.log('Test product created successfully');

        // Clean up test data
        await Vendor.deleteOne({ email: "test@vendor.com" });
        await Product.deleteOne({ name: "Test Cement" });
        console.log('\nTest data cleaned up');

        // Check indexes
        console.log('\nCollection indexes:');
        const vendorIndexes = await Vendor.collection.getIndexes();
        console.log('Vendor indexes:', Object.keys(vendorIndexes));

        const productIndexes = await Product.collection.getIndexes();
        console.log('Product indexes:', Object.keys(productIndexes));

        console.log('\nDatabase setup is complete and working correctly!');
    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testDatabase(); 