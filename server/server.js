require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('./models/Vendor');
const User = require('./models/User');
const Order = require('./models/Order');
const Verification = require('./models/Verification');
const Product = require('./models/Product');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes

// Vendor Registration
app.post('/api/vendors/register', async (req, res) => {
    try {
        const { name, email, password, company, location, businessType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const vendor = new Vendor({
            name,
            email,
            password: hashedPassword,
            company,
            location,
            businessType
        });

        await vendor.save();
        res.status(201).json({ message: 'Vendor registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vendor Login
app.post('/api/vendors/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const vendor = await Vendor.findOne({ email });
        
        if (!vendor) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, vendor.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { vendorId: vendor._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Vendor Orders
app.get('/api/vendors/:vendorId/orders', async (req, res) => {
    try {
        const orders = await Order.find({ vendorId: req.params.vendorId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Verification Record
app.post('/api/verifications', async (req, res) => {
    try {
        const verification = new Verification(req.body);
        await verification.save();
        res.status(201).json(verification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            address
        });
        
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ token, user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Products by Vendor
app.get('/api/vendors/:vendorId/products', async (req, res) => {
    try {
        const products = await Product.find({ 
            manufacturer: req.params.vendorId,
            isAvailable: true 
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
