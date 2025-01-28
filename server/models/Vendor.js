const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
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
    company: {
        type: String,
        required: true
    },
    location: String,
    businessType: {
        type: String,
        enum: ['manufacturer', 'distributor', 'retailer']
    },
    phone: String,
    verified: {
        type: Boolean,
        default: false
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', vendorSchema);
