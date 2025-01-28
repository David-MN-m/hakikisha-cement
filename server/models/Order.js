const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    cementType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: Date,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: String
});

module.exports = mongoose.model('Order', orderSchema);
