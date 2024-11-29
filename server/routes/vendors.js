const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// Get all vendors
router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get verified vendors
router.get('/verified', async (req, res) => {
    try {
        const vendors = await Vendor.find({ verified: true });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single vendor
router.get('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (vendor) {
            res.json(vendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new vendor
router.post('/', async (req, res) => {
    const vendor = new Vendor({
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
        contactInfo: req.body.contactInfo,
        deliveryAvailable: req.body.deliveryAvailable
    });

    try {
        const newVendor = await vendor.save();
        res.status(201).json(newVendor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update vendor verification status
router.patch('/:id/verify', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (vendor) {
            vendor.verified = req.body.verified;
            const updatedVendor = await vendor.save();
            res.json(updatedVendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
