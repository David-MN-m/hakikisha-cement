const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed', 
            error: error.message 
        });
    }
};

// Enhanced error handling with more specific messages
const authEnhanced = async (req, res, next) => {
    try {
        // Get token and check if it exists
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }

        // Extract token
        const token = authHeader.replace('Bearer ', '');
        
        // Verify token
        let decoded;
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET not configured');
            }
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token verified successfully:', { userId: decoded.id, role: decoded.role });
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            } else if (jwtError.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
            throw jwtError;
        }
        
        // Find user
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        console.log('User found:', { id: user._id, role: user.role }); // Log successful user fetch

        // Attach user to request
        req.user = user;
        req.token = token;
        console.log('Middleware completed, passing to next handler'); // Confirm next() call
        next();
    } catch (error) {
        console.error('Auth Error:', {
            message: error.message,
            stack: error.stack,
            token: req.header('Authorization') ? req.header('Authorization').substring(0, 10) + '...' : 'None'
        });
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed', 
            error: error.message 
        });
    }
};

module.exports = authEnhanced;