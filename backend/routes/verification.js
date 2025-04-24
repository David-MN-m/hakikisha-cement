const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Ensure you have the auth middleware

// Example verification route
router.post('/verify', auth, async (req, res) => {
    console.log('User:', req.user); // Log the authenticated user
    try {
        // Your verification logic here
        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error('Verification error:', error); // Log the error for debugging
        res.status(400).json({ message: 'Verification failed. Please try again.' });
    }
});

module.exports = router; 