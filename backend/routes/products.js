const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const mongoose = require('mongoose'); // Ensure mongoose is imported for connection state

// Utility function to generate verification code
function generateVerificationCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Get all products with extensive logging
router.get('/', async (req, res) => {
    try {
        console.log('🔍 Attempting to fetch all products...');
        if (!Product) {
            console.error('❌ Product model is not defined!');
            return res.status(500).json({ error: 'Product model not found' });
        }

        console.log('📦 Mongoose Connection State:', mongoose.connection.readyState);
        const products = await Product.find();
        
        console.log('✅ Products fetched successfully:');
        console.log('Total Products:', products.length);
        console.log('Product Details:', JSON.stringify(products, null, 2));
        
        if (products.length === 0) {
            console.warn('⚠️ No products found in the database');
        }
        
        res.json(products);
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Create new product (vendor only)
router.post('/', auth, async (req, res) => {
    try {
        const {
            name,
            brand,
            type,
            strengthClass,
            price,
            stock,
            description,
            verificationCode,
            vendorId
        } = req.body;

        // Validate required fields
        if (!name || !brand || !type || !strengthClass || !price || !stock || !verificationCode || !vendorId) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const product = new Product({
            name,
            brand,
            type,
            strengthClass,
            price,
            stock,
            description,
            verificationCode,
            vendorId
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// Update product (vendor only)
router.put('/:id', auth, async (req, res) => {
    try {
        console.log(`🔄 Attempting to update product: ${req.params.id}`);
        console.log('User:', req.user);

        const product = await Product.findById(req.params.id);

        if (!product) {
            console.warn(`⚠️ Product not found: ${req.params.id}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.vendorId.toString() !== req.user.id) {
            console.warn(`⚠️ Unauthorized update attempt for product: ${req.params.id}`);
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(product, req.body);
        await product.save();

        console.log('✅ Product updated successfully:', product);
        res.json(product);
    } catch (error) {
        console.error('❌ Error updating product:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Get products by vendor ID (corrected to match dashboard expectation)
router.get('/vendor/:vendorId', auth, async (req, res) => {
    try {
        console.log('Fetching products for vendor:', req.params.vendorId); // Debug log
        const products = await Product.find({ vendorId: req.params.vendorId });
        console.log('Found products:', products); // Debug log
        res.json(products);
    } catch (error) {
        console.error('Error fetching vendor products:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;