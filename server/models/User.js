const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        location: String
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    registrationDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date
});

module.exports = mongoose.model('User', userSchema); 