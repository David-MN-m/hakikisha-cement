const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Rating = require('../models/Rating'); 
const Verification = require('../models/Verification'); 
const Product = require('../models/Product'); 

// Remove User
router.delete('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Vendor Ratings
router.get('/vendor-ratings', async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.json({ success: true, ratings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Verification Information
router.get('/verification-info', async (req, res) => {
    try {
        const verifications = await Verification.find();
        res.json({ success: true, verifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to add a new product
router.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await Product.create(newProduct);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
