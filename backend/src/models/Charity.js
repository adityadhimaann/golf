const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { type: String },
  image_url: { type: String },
  category: { type: String },
  is_featured: { 
    type: Boolean, 
    default: false 
  },
  events: [
    {
      title: String,
      date: Date,
      description: String
    }
  ],
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Charity', charitySchema);
