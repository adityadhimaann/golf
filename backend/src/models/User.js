const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false 
  },
  full_name: { 
    type: String, 
    required: [true, 'Full name is required'] 
  },
  role: { 
    type: String, 
    enum: ['subscriber', 'admin'], 
    default: 'subscriber' 
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'lapsed'],
    default: 'active'
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  charity_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Charity' 
  },
  charity_percentage: { 
    type: Number, 
    default: 10, 
    min: 10, 
    max: 100 
  },
  stripe_customer_id: { 
    type: String 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password helper
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
