const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    productQuality: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5 
    },
    delivery: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5 
    },
    timeEfficiency: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5 
    },
    comment: { 
        type: String, 
        required: false 
    },
    vendorReply: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
