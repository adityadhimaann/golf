const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { 
    type: String, 
    required: true 
  },
  draw_date: { 
    type: Date, 
    required: true 
  },
  drawn_numbers: [{ 
    type: Number 
  }],
  mode: { 
    type: String, 
    enum: ['random', 'algorithmic'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'simulated', 'published'], 
    default: 'pending' 
  },
  jackpot_carried: { 
    type: Boolean, 
    default: false 
  },
  jackpot_amount: { 
    type: Number, 
    default: 0 
  },
  total_prize_pool: { 
    type: Number, 
    default: 0 
  },
  subscriber_count: { 
    type: Number, 
    default: 0 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Draw', drawSchema);
