// This file defines how a Request is stored in MongoDB
// Think of it like a template for every facility request

const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({

  // Title of the request
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },

  // Detailed description of the request
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },

  // Current status of the request
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Pending', 'Resolved'],
    default: 'New'
  },

  // Who created this request
  created_by: {
    type: String,
    required: [true, 'Creator is required']
  },

  // Which user role created this request
  created_by_role: {
    type: String,
    required: true
  },

  // Date when request was created
  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Export this model so other files can use it
module.exports = mongoose.model('Request', RequestSchema);