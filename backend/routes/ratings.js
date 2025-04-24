const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Create Rating with auth
router.post('/', auth, async (req, res) => {
    try {
        const rating = new Rating({
            ...req.body,
            customerId: req.user._id // Get customer ID from authenticated user
        });
        await rating.save();
        res.status(201).json(rating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Ratings
router.get('/', async (req, res) => {
    try {
        const ratings = await Rating.find(); // Fetch all ratings from MongoDB
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Ratings by Vendor ID
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const ratings = await Rating.find({ vendorId: req.params.vendorId })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Customer's Ratings
router.get('/my-ratings', auth, async (req, res) => {
    try {
        const ratings = await Rating.find({ customerId: req.user._id })
            .populate('vendorId', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Rating by ID
router.get('/:id', async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id); // Fetch rating by ID
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Vendor Reply
router.patch('/:id/reply', auth, async (req, res) => {
    try {
        const rating = await Rating.findOne({ 
            _id: req.params.id,
            vendorId: req.user._id // Ensure vendor owns the rating
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found or unauthorized' });
        }

        rating.vendorReply = req.body.reply;
        await rating.save();
        res.status(200).json(rating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Rating (only for customer who created it)
router.put('/:id', auth, async (req, res) => {
    try {
        const rating = await Rating.findOne({
            _id: req.params.id,
            customerId: req.user._id
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found or unauthorized' });
        }

        Object.assign(rating, req.body);
        await rating.save();
        res.status(200).json(rating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Rating (only for customer who created it)
router.delete('/:id', auth, async (req, res) => {
    try {
        const rating = await Rating.findOneAndDelete({
            _id: req.params.id,
            customerId: req.user._id
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found or unauthorized' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add this route
router.get('/vendors', async (req, res) => {
    try {
        // Assuming you have a User model with a role field
        const vendors = await User.find({ role: 'vendor' });
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
