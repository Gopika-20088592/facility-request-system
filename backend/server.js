// This is the main file that starts our backend server
// It brings together all routes and connects everything

const express = require('express');
const cors = require('cors');

// Import our routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Import database so tables get created when server starts
const db = require('./models/db');

// Create our express app
const app = express();

// Allow React frontend to talk to this backend
app.use(cors());

// Allow the server to understand JSON data
app.use(express.json());

// Use our routes
app.use(authRoutes);
app.use(requestRoutes);

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Backend server is running on http://localhost:5000');
});