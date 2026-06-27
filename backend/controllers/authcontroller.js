// This file handles login and register logic
// Think of it like a security guard checking your ID

const db = require('../models/db');

// REGISTER - Create a new user account
const register = (req, res) => {

  // Get username, password and role from the request
  const { username, password, role } = req.body;

  // Check if all fields are filled
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Please fill all fields!' });
  }

  try {
    // Save new user to database
    db.prepare(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    ).run(username, password, role);

    res.json({ message: 'Account created successfully!' });

  } catch (error) {
    // This runs if username already exists
    res.status(400).json({ message: 'Username already exists!' });
  }

};

// LOGIN - Check if user exists
const login = (req, res) => {

  // Get username and password from the request
  const { username, password } = req.body;

  // Check if both fields are filled
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter username and password!' });
  }

  // Look for user in database
  const user = db.prepare(
    'SELECT * FROM users WHERE username = ? AND password = ?'
  ).get(username, password);

  // If user found - login successful
  if (user) {
    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } else {
    // If user not found - wrong username or password
    res.status(401).json({ message: 'Wrong username or password!' });
  }

};

// Share these functions with other files
module.exports = { register, login };