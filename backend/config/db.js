// This file connects our application to MongoDB database
// It uses mongoose package to make the connection easy

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using the address from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful show this message
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // If connection fails show the error and stop the server
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Share this function with other files
module.exports = connectDB;