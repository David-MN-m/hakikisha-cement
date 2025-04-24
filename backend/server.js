require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hakikisha_cement';
        console.log('Attempting to connect to MongoDB at:', mongoURI);
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB connected successfully!');
        console.log('Database Name:', mongoose.connection.db.databaseName);
        console.log('Connection Host:', mongoose.connection.host);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', { message: error.message, stack: error.stack });
        process.exit(1);
    }
};

connectDB();

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    connectDB();
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', { message: err.message, stack: err.stack });
});

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const verificationRoutes = require('./routes/verifications');
const ratingRoutes = require('./routes/ratings');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin: '*',  // For development - change this to your frontend URL later
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Serve static files first
const staticPath = path.join(__dirname, 'frontend');
app.use(express.static(staticPath));
console.log("📂 Serving static files from:", staticPath);

app.get('/landing.html', (req, res) => {
    res.sendFile(path.join(staticPath, 'landing.html'));
});

const socket = require('./utils/socket');
const io = socket.setupSocket(httpServer);
app.set('io', io);

// Log all requests with MongoDB state
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('MongoDB Connection State:', mongoose.connection.readyState);
    next();
});

// Public routes
app.use('/api/auth', authRoutes);
// New public route for vendors
app.use('/api/vendors', userRoutes); // Mount userRoutes for public access to /vendors

// Register routes
app.use('/api/users', userRoutes);

// Protected routes with auth middleware
const protectedRoutes = express.Router();
protectedRoutes.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Entering middleware for ${req.method} ${req.url}`);
    const originalNext = next;
    next = function(err) {
        if (err) {
            console.error(`[${new Date().toISOString()}] Middleware Error:`, {
                message: err.message,
                stack: err.stack
            });
            return originalNext(err);
        }
        console.log(`[${new Date().toISOString()}] Middleware completed for ${req.method} ${req.url}`);
        originalNext();
    };
    authMiddleware(req, res, next);
});

protectedRoutes.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Route handler about to be invoked for ${req.method} ${req.url}`);
    next();
});

app.use('/api/products', protectedRoutes, productRoutes);
app.use('/api/orders', protectedRoutes, orderRoutes);
app.use('/api/ratings', protectedRoutes, ratingRoutes);
app.use('/api/users', protectedRoutes, userRoutes); // Protected user routes
app.use('/api/verifications', protectedRoutes, verificationRoutes);
app.use('/api/admin', protectedRoutes, adminRoutes);

app.get('/api/protected-route', protectedRoutes, (req, res) => {
    res.send('This is a protected route');
});

app.get('/api/all-data', async (req, res) => {
    try {
        res.json({ message: 'Not implemented yet' });
    } catch (error) {
        console.error("❌ Error fetching all data:", error.message);
        res.status(500).json({ message: '❌ Error fetching all data', error: error.message });
    }
});

app.get('/test', (req, res) => { 
    console.log('🛠️ Test route accessed');
    res.send('✅ Test route is working');
});

app.get('/', (req, res) => {
    res.send('🔥 Hakikisha API is running...');
});

// Enhanced error handler
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Server Error:`, {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body
    });
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('⚠️ Unhandled Promise Rejection:', {
        message: err.message,
        stack: err.stack
    });
    httpServer.close(() => process.exit(1));
});