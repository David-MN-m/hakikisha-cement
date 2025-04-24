const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['OPC', 'PPC', 'RHPC', 'SRC', 'MC'],
        required: true
    },
    brand: {
        type: String,
        enum: ['Bamburi', 'Simba', 'Savannah', 'Mombasa', 'National', 'EastAfrican'],
        required: true
    },
    strengthClass: {
        type: String,
        enum: ['32.5N', '32.5R', '42.5N', '42.5R', '52.5N', '52.5R'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String
    },
    verificationCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);