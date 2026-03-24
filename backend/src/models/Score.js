const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  score: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 45 
  },
  date_played: { 
    type: Date, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for efficient score lookups
scoreSchema.index({ user_id: 1, date_played: -1 });

module.exports = mongoose.model('Score', scoreSchema);
