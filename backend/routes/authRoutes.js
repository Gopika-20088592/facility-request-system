// This file sets up the URLs for login and register
// It also validates the inputs before sending to controller

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import login and register functions from controller
const { register, login } = require('../controllers/authController');

// REGISTER URL - with input validation
router.post('/register', [
  // Check username is not empty
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim(),

  // Check password is at least 6 characters
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // Check role is valid
  body('role')
    .isIn(['user', 'staff', 'admin'])
    .withMessage('Role must be user, staff or admin')

], register);

// LOGIN URL - with input validation
router.post('/login', [
  // Check username is not empty
  body('username')
    .notEmpty()
    .withMessage('Username is required'),

  // Check password is not empty
  body('password')
    .notEmpty()
    .withMessage('Password is required')

], login);

// Share these routes with server.js
module.exports = router;