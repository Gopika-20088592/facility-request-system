// This is the main file that starts our backend server
// It connects to MongoDB and loads all our routes

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create express app
const app = express();

// Allow React frontend to talk to this backend
app.use(cors());

// Allow server to understand JSON data
app.use(express.json());

// Import and use our routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api', authRoutes);
app.use('/api', requestRoutes);

// Simple home route to check server is running
app.get('/', (req, res) => {
  res.json({ message: 'facility Request System API is running!' });
});

// Start server on port from .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});