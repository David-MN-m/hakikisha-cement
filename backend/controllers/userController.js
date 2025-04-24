const User = require('../models/User');

// Create User
const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Vendors
const getAllVendors = async (req, res) => {
    try {
        console.log('Fetching all vendors...');
        const vendors = await User.find({ 
            role: 'vendor',
            'vendorProfile.active': true 
        })
        .select('businessName email phone vendorProfile address')
        .populate('vendorProfile.products');

        console.log(`Found ${vendors.length} active vendors`);

        const sanitizedVendors = vendors.map(vendor => ({
            id: vendor._id,
            businessName: vendor.businessName || 'Unnamed Business',
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            products: vendor.vendorProfile?.products || []
        }));

        res.status(200).json(sanitizedVendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching vendors',
            error: error.message 
        });
    }
};

// Search Vendors
const searchVendors = async (req, res) => {
    try {
        const { query } = req.query;
        console.log('Searching vendors with query:', query);

        const searchQuery = {
            role: 'vendor',
            'vendorProfile.active': true,
            $or: [
                { businessName: new RegExp(query, 'i') },
                { address: new RegExp(query, 'i') }
            ]
        };

        const vendors = await User.find(searchQuery)
            .select('businessName email phone vendorProfile address')
            .populate('vendorProfile.products');

        console.log(`Found ${vendors.length} vendors matching query`);

        const sanitizedVendors = vendors.map(vendor => ({
            id: vendor._id,
            businessName: vendor.businessName || 'Unnamed Business',
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            products: vendor.vendorProfile?.products || []
        }));

        res.status(200).json(sanitizedVendors);
    } catch (error) {
        console.error('Error searching vendors:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error searching vendors',
            error: error.message 
        });
    }
};

// Update vendor profile
const updateVendorProfile = async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Only vendors can update vendor profiles' });
        }

        const updates = {
            businessName: req.body.businessName,
            phone: req.body.phone,
            address: req.body.address,
            'vendorProfile.active': req.body.active
        };

        const vendor = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json({
            id: vendor._id,
            businessName: vendor.businessName,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            active: vendor.vendorProfile?.active
        });
    } catch (error) {
        console.error('Error updating vendor profile:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllVendors,
    searchVendors,
    updateVendorProfile
};
