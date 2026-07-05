const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('User', UserSchema);