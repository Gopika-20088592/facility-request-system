// This file handles login and register logic
// Passwords are encrypted using bcrypt
// JWT token is created after successful login

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// REGISTER - Create a new user account
const register = async (req, res) => {

  // Check if all inputs are valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password, role } = req.body;

  try {
    // Check if username already exists in database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists!' });
    }

    // Encrypt the password before saving
    // The number 10 means how strong the encryption is
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with encrypted password
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    // Save user to MongoDB
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }

};

// LOGIN - Check if user exists and password is correct
const login = async (req, res) => {

  // Check if all inputs are valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password } = req.body;

  try {
    // Find user in MongoDB database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password!' });
    }

    // Compare entered password with encrypted password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password!' });
    }

    // Create JWT token - like a temporary ID card
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send token and user details back to frontend
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }

};

// Share these functions with other files
module.exports = { register, login };