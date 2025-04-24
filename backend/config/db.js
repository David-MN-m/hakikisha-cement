const Product = require('../models/Product');
const Order = require('../models/Order');
const Rating = require('../models/Rating');
const User = require('../models/User');
const Verification = require('../models/Verification');

// Product Operations
async function getAllProducts() {
    return await Product.find();
}

async function insertProduct(product) {
    const newProduct = new Product(product);
    return await newProduct.save();
}

async function updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
}

// Order Operations
async function getAllOrders() {
    return await Order.find().populate('vendorId').populate('customerId').populate('items.productId');
}

async function insertOrder(orderData) {
    const newOrder = new Order(orderData);
    return await newOrder.save();
}

async function updateOrderStatus(id, status) {
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
}

// Rating Operations
async function getAllRatings() {
    return await Rating.find().populate('vendorId');
}

async function insertRating(ratingData) {
    const newRating = new Rating(ratingData);
    return await newRating.save();
}

// User Operations
async function getAllUsers() {
    return await User.find();
}

async function insertUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
}

async function findUserByEmail(email) {
    return await User.findOne({ email });
}

// Verification Operations
async function getAllVerifications() {
    return await Verification.find().populate('userId');
}

async function insertVerification(verificationData) {
    const newVerification = new Verification(verificationData);
    return await newVerification.save();
}

module.exports = {
    // Product Methods
    getAllProducts,
    insertProduct,
    updateProduct,
    deleteProduct,

    // Order Methods
    getAllOrders,
    insertOrder,
    updateOrderStatus,

    // Rating Methods
    getAllRatings,
    insertRating,

    // User Methods
    getAllUsers,
    insertUser,
    findUserByEmail,

    // Verification Methods
    getAllVerifications,
    insertVerification
};
