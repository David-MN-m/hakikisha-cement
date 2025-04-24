const mongoose = require('mongoose');

// Database connection with retry logic
const connectWithRetry = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    connectWithRetry();
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

module.exports = { connectWithRetry }; 