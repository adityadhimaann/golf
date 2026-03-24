const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  plan: { 
    type: String, 
    enum: ['monthly', 'yearly'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'cancelled', 'lapsed'], 
    default: 'inactive' 
  },
  stripe_subscription_id: { type: String },
  stripe_customer_id: { type: String },
  current_period_start: { type: Date },
  current_period_end: { type: Date },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
