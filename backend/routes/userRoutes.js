const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const {
    getAllVendors,
    searchVendors,
    updateVendorProfile
} = require('../controllers/userController');

// POST new user (unchanged)
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET all users (unchanged)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET user by ID (unchanged)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update user (unchanged)
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE user (unchanged)
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Test route (unchanged)
router.get('/test-vendors', (req, res) => {
    console.log('Test route /test-vendors invoked');
    res.status(200).json([{ id: 'test', businessName: 'Test Vendor' }]);
});

// Vendor routes
router.get('/vendors', auth, async (req, res) => {
    try {
        console.log('Fetching vendors...');
        
        const vendors = await User.find({ 
            role: 'vendor' 
        }).select('-password');
        
        console.log(`Found ${vendors.length} vendors`);
        
        res.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ 
            message: 'Error fetching vendors', 
            error: error.message 
        });
    }
});
router.get('/vendors/search', auth, searchVendors);
router.patch('/vendors/profile', auth, updateVendorProfile);

// Get all vendors route
router.get('/vendors/list', auth, async (req, res) => {
    try {
        console.log('Fetching vendors from database...');
        
        const vendors = await User.find({ 
            role: 'vendor' 
        }).select('businessName email phone address');
        
        console.log(`Found ${vendors.length} vendors`);
        
        const sanitizedVendors = vendors.map(vendor => ({
            id: vendor._id,
            businessName: vendor.businessName || 'Unnamed Business',
            email: vendor.email,
            phone: vendor.phone || 'No phone',
            address: vendor.address || 'No address'
        }));

        res.json(sanitizedVendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ 
            message: 'Error fetching vendors', 
            error: error.message 
        });
    }
});

module.exports = router;