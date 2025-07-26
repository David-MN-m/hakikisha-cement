require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI not found in .env");
        }

        console.log('🌍 Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Atlas connected!');
        console.log('🗄️  DB Name:', mongoose.connection.db.databaseName);
        console.log('📡 Host:', mongoose.connection.host);
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

connectDB();

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
    connectDB();
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Error:', {
        message: err.message,
        stack: err.stack,
    });
});

// Routes
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

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// Static files
const staticPath = path.join(__dirname, 'frontend');
app.use(express.static(staticPath));
console.log("📁 Serving frontend from:", staticPath);

app.get('/landing.html', (req, res) => {
    res.sendFile(path.join(staticPath, 'landing.html'));
});

// Socket.io setup
const socket = require('./utils/socket');
const io = socket.setupSocket(httpServer);
app.set('io', io);

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('MongoDB State:', mongoose.connection.readyState);
    next();
});

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', userRoutes); // vendor preview access
app.use('/api/users', userRoutes);

// Protected Routes
const protectedRoutes = express.Router();

protectedRoutes.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Middleware Check: ${req.method} ${req.url}`);
    const originalNext = next;
    next = function(err) {
        if (err) {
            console.error(`[${new Date().toISOString()}] Middleware Error:`, err);
            return originalNext(err);
        }
        originalNext();
    };
    authMiddleware(req, res, next);
});

protectedRoutes.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Accessing protected route: ${req.method} ${req.url}`);
    next();
});

app.use('/api/products', protectedRoutes, productRoutes);
app.use('/api/orders', protectedRoutes, orderRoutes);
app.use('/api/ratings', protectedRoutes, ratingRoutes);
app.use('/api/users', protectedRoutes, userRoutes); // re-mounted protected
app.use('/api/verifications', protectedRoutes, verificationRoutes);
app.use('/api/admin', protectedRoutes, adminRoutes);

// Test Routes
app.get('/api/protected-route', protectedRoutes, (req, res) => {
    res.send('🔒 You’ve reached a protected route');
});

app.get('/api/all-data', async (req, res) => {
    try {
        res.json({ message: '📊 All data endpoint placeholder' });
    } catch (error) {
        console.error("❌ Error fetching data:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/test', (req, res) => {
    console.log('🧪 Test route hit');
    res.send('✅ Test route is operational');
});

app.get('/', (req, res) => {
    res.send('🔥 Hakikisha Verifier API is up and running!');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Unhandled Error:`, err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Server Start
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled Promise Rejection:', err);
    httpServer.close(() => process.exit(1));
});
