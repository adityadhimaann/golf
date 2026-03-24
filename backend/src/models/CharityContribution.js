const mongoose = require('mongoose');

const charityContributionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  charity_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Charity', 
    required: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  source: { 
    type: String, 
    enum: ['subscription', 'manual'] 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CharityContribution', charityContributionSchema);
