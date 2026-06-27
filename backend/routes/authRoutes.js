// This file sets up the URLs for login and register
// Think of it like a signboard directing traffic

const express = require('express');
const router = express.Router();

// Import login and register functions from controller
const { register, login } = require('../controllers/authController');

// When someone goes to /register - run the register function
router.post('/register', register);

// When someone goes to /login - run the login function
router.post('/login', login);

// Share these routes with server.js
module.exports = router;