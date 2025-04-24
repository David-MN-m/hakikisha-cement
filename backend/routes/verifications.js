const express = require('express');
const router = express.Router();
const Verification = require('../models/Verification');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Verify product
router.post('/verify', auth, async (req, res) => {
    try {
        const { code } = req.body;
        
        const product = await Product.findOne({ verificationCode: code });

        if (!product) {
            return res.status(404).json({ 
                status: 'invalid',
                message: 'Invalid verification code' 
            });
        }

        const newVerification = new Verification({
            productId: product._id,
            userId: req.user.id, // Changed to req.user.id to match JWT payload
            status: 'valid',
            verifiedAt: new Date()
        });

        const savedVerification = await newVerification.save();

        const io = req.app.get('io');
        io.to(`vendor-${product.vendorId}`).emit('productVerified', {
            productId: product._id,
            verificationId: savedVerification._id
        });

        res.json({
            status: 'valid',
            product,
            verification: savedVerification
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get verification history
router.get('/history', auth, async (req, res) => {
    try {
        const verifications = await Verification.find({ userId: req.user.id }) // Changed to req.user.id
            .populate('productId')
            .sort({ createdAt: -1 });

        res.json(verifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all verifications
router.get('/', async (req, res) => {
    try {
        const verifications = await Verification.find()
            .populate('userId', 'name')
            .populate('productId')
            .sort({ createdAt: -1 });

        res.json(verifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit verification (used by results.html)
router.post('/', auth, async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('User ID:', req.user.id); // Changed to req.user.id

    try {
        const verification = new Verification({
            userId: req.user.id, // Changed to req.user.id
            status: 'completed',
            documentUrl: 'verification-report',
            verificationData: req.body
        });

        await verification.save();
        
        res.status(201).json({
            success: true,
            message: 'Verification recorded successfully',
            data: verification
        });

    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to record verification',
            error: error.message 
        });
    }
});

// Get customer verifications
router.get('/customer/:customerId', auth, async (req, res) => {
    try {
        const verifications = await Verification.find({ userId: req.params.customerId })
            .populate('productId')
            .sort({ createdAt: -1 });
        res.json(verifications);
    } catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add this route after existing routes

router.get('/customer/:customerId', auth, async (req, res) => {
    try {
        console.log('Fetching verifications for customer:', req.params.customerId);
        const verifications = await Verification.find({ userId: req.params.customerId })
            .populate('productId')
            .sort({ createdAt: -1 });
        console.log('Found verifications:', verifications.length);
        res.json(verifications);
    } catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;