const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger'); 
const auth = require('../middleware/auth');

router.use(cors({
    origin: 'http://localhost:5500', // Correct frontend port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

router.use(helmet());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.use('/login', apiLimiter);
router.use('/register', apiLimiter);

router.post('/register', async (req, res) => {
    try {
        const { email, password, role, name, businessName, phone, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const userData = {
            email,
            password,
            role,
            phone,
            address
        };

        if (role === 'customer') {
            userData.name = name;
            userData.customerDetails = {
                preferredProducts: [],
                orderHistory: []
            };
        } else if (role === 'vendor') {
            userData.businessName = businessName;
            userData.vendorDetails = {
                businessLicense: '',
                products: [],
                ratings: []
            };
        }

        const user = new User(userData);
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                businessName: user.businessName
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email, role }); // Filter by role
        if (!user) {
            console.log(`Login failed: No user found with email ${email} and role ${role}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`Login successful for ${email} with role ${role}`);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                businessName: user.businessName
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.role === 'customer' ? user.name : undefined,
                businessName: user.role === 'vendor' ? user.businessName : undefined
            }))
        });
    } catch (error) {
        logger.error(`Error fetching all users: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = req.body;
        const user = new User(newUser);
        await user.save();
        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.role === 'customer' ? user.name : undefined,
                businessName: user.role === 'vendor' ? user.businessName : undefined
            }
        });
    } catch (error) {
        logger.error(`Error adding new user: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

module.exports = router;