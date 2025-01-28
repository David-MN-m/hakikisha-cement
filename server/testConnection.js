require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 