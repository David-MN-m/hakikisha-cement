const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    required: [true, 'Role is required'],
    default: 'customer'
  },
  // Fields for both customer and vendor
  name: String,           // For customers
  businessName: {
    type: String,
    required: function() {
      return this.role === 'vendor';
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  // Customer specific fields
  customerDetails: {
    preferredProducts: [String],
    orderHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }]
  },
  // Vendor specific fields
  vendorDetails: {
    businessLicense: String,
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    ratings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating'
    }]
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;