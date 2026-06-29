// This file defines how a User is stored in MongoDB
// Think of it like a template for every user in our system

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  // Username - must be unique, no two users can have same username
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },

  // Password - will be encrypted before saving
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // Role - can only be user, staff or admin
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },

  // Date when account was created
  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Export this model so other files can use it
module.exports = mongoose.model('User', UserSchema);