const mongoose = require('mongoose');

const prizePoolSchema = new mongoose.Schema({
  draw_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Draw', 
    required: true,
    index: true 
  },
  total_pool: { 
    type: Number, 
    required: true 
  },
  tier_5_pool: { type: Number },
  tier_4_pool: { type: Number },
  tier_3_pool: { type: Number },
  subscriber_count: { type: Number },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrizePool', prizePoolSchema);
