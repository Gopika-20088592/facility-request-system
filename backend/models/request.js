const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },

  status: {
    type: String,
    enum: ['New', 'In Progress', 'Pending', 'Resolved'],
    default: 'New'
  },

  reason: {
    type: String,
    default: ''
  },

  created_by: {
    type: String,
    required: [true, 'Creator is required']
  },

  created_by_role: {
    type: String,
    required: true
  },

  raised_for: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Request', RequestSchema);