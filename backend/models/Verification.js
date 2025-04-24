const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: String, 
        required: true 
    },
    documentUrl: { 
        type: String, 
        required: true 
    },
    verificationData: {
        manufacturer: String,
        brand: String,
        county: String,
        location: String,
        origin: String,
        declaredWeight: Number,
        actualWeight: Number,
        strengthClass: String,
        intendedUse: String,
        kebsPresent: String,
        stickerCondition: String,
        manufactureDate: Date,
        storageCondition: String
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
