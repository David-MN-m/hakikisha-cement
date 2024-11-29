const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('vendorId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get orders by vendor
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const orders = await Order.find({ vendorId: req.params.vendorId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    const order = new Order({
        vendorId: req.body.vendorId,
        customerInfo: req.body.customerInfo,
        orderDetails: req.body.orderDetails,
        deliveryAddress: req.body.deliveryAddress,
        paymentMethod: req.body.paymentMethod
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.orderStatus = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.paymentStatus = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
