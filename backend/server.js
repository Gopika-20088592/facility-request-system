// This is the main file that starts our backend server
// It connects to MongoDB and loads all our routes

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create express app
const app = express();

// Add security headers - protects against XSS and other attacks
app.use(helmet());

// Allow React frontend to talk to this backend
app.use(cors());

// Allow server to understand JSON data
app.use(express.json());

// Prevent malicious database queries
app.use(mongoSanitize());

// Import and use our routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api', authRoutes);
app.use('/api', requestRoutes);

// Simple home route to check server is running
app.get('/', (req, res) => {
  res.json({ message: 'Facility Request System API is running successfully!' });
});

// Start server on port from .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});