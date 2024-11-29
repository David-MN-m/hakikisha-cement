const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cement-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Order = require('./models/Order');
const Vendor = require('./models/Vendor');

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/vendors', require('./routes/vendors'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
