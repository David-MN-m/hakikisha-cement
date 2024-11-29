const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    deliveryAvailable: {
        type: Boolean,
        default: true
    },
    contactInfo: {
        email: String,
        phone: String,
        address: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', vendorSchema);
