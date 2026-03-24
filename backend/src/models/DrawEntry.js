const mongoose = require('mongoose');

const drawEntrySchema = new mongoose.Schema({
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
  scores_snapshot: [{ 
    type: Number 
  }],
  matched_numbers: [{ 
    type: Number 
  }],
  match_count: { 
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

module.exports = mongoose.model('DrawEntry', drawEntrySchema);
