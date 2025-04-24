const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get orders (filtered by role, with populated data)
router.get('/', auth, async (req, res) => {
    try {
        console.log('🔍 Fetching orders for user:', req.user.id);
        const orders = await Order.find({
            $or: [{ vendorId: req.user.id }, { customerId: req.user.id }]
        })
        .populate('vendorId', 'businessName')
        .populate('customerId', 'name')
        .populate('items.productId', 'name brand price');

        console.log('✅ Orders fetched:', orders.length);
        if (orders.length === 0) {
            console.warn('⚠️ No orders found for user:', req.user.id);
        }

        res.json(orders);
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new order (customer only)
router.post('/', auth, async (req, res) => {
    try {
        const { customerId, vendorId, items, totalAmount } = req.body;
        
        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                message: 'Order must contain at least one item' 
            });
        }

        // Create the order
        const order = new Order({
            customerId,
            vendorId,
            items,
            totalAmount,
            status: 'pending'
        });

        console.log('Creating order:', order);

        const savedOrder = await order.save();
        console.log('Order saved:', savedOrder);
        
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('❌ Order creation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.customerId.toString() !== req.user.id && order.vendorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.status = status;
        await order.save();

        const io = req.app.get('io');
        io.to(`vendor-${order.vendorId}`).emit('orderStatusUpdated', order);

        console.log('✅ Order status updated:', order);
        res.json({ success: true, order });
    } catch (error) {
        console.error('❌ Error updating order status:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get customer orders
router.get('/customer/:customerId', auth, async (req, res) => {
    try {
        console.log('Fetching orders for customer:', req.params.customerId);
        const orders = await Order.find({ customerId: req.params.customerId })
            .populate('vendorId', 'businessName')
            .populate('items.productId')
            .sort({ createdAt: -1 });
        console.log('Found orders:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;