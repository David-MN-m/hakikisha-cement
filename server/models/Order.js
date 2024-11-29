const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    customerInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    orderDetails: {
        quantity: { type: Number, required: true },
        deliveryDate: { type: Date, required: true },
        totalAmount: { type: Number, required: true }
    },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        location: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'card', 'bank'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
