const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    batchNumber: {
        type: String,
        required: true,
        unique: true
    },
    manufacturerName: {
        type: String,
        required: true
    },
    productionDate: {
        type: Date,
        required: true
    },
    expiryDate: Date,
    cementType: {
        type: String,
        required: true
    },
    strength: String,
    verificationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['verified', 'unverified', 'expired', 'recalled'],
        default: 'unverified'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    qualityScore: {
        type: Number,
        min: 0,
        max: 100
    },
    testResults: {
        compressionStrength: Number,
        moistureContent: Number,
        settingTime: Number
    }
});

module.exports = mongoose.model('Verification', verificationSchema); 