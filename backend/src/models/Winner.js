const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  draw_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Draw', 
    required: true,
    index: true 
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  tier: { 
    type: Number, 
    enum: [3, 4, 5], 
    required: true 
  },
  prize_amount: { 
    type: Number, 
    required: true 
  },
  proof_url: { type: String },
  proof_status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  payout_status: { 
    type: String, 
    enum: ['pending', 'paid'], 
    default: 'pending' 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Winner', winnerSchema);
