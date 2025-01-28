const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cementType: {
        type: String,
        required: true,
        enum: [
            'Ordinary Portland Cement (OPC)',
            'Portland Pozzolana Cement (PPC)',
            'Rapid Hardening Cement',
            'Quick Setting Cement',
            'Low Heat Cement',
            'Sulfate Resisting Cement',
            'Portland Blast Furnace Cement',
            'White Cement',
            'Colored Cement',
            'Masonry Cement'
        ]
    },
    grade: {
        type: String,
        enum: ['32.5', '42.5', '52.5'],
        required: true
    },
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    strength: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    packagingSize: {
        type: Number,
        default: 50,  // Standard 50kg bag
        enum: [25, 50]  // Available sizes in kg
    },
    description: String,
    specifications: {
        weight: Number,
        composition: String,
        applications: [{
            type: String,
            enum: [
                'General Construction',
                'High-Rise Buildings',
                'Roads and Bridges',
                'Marine Construction',
                'Precast Concrete',
                'Interior Finishing',
                'Residential Construction',
                'Commercial Construction',
                'Industrial Construction'
            ]
        }],
        settingTime: {
            initial: Number,  // in minutes
            final: Number    // in minutes
        },
        strengthDevelopment: {
            threeDay: Number,
            sevenDay: Number,
            twentyEightDay: Number
        }
    },
    certifications: [{
        type: String,
        enum: ['KS EAS 18-1', 'ISO 9001', 'CE Mark']
    }],
    stockQuantity: {
        type: Number,
        default: 0
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1
    },
    maximumOrderQuantity: {
        type: Number,
        default: 1000
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema); 