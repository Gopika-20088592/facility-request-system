// This file checks if the user has a valid login token
// It protects routes that should only be accessed by logged in users
// Think of it like a security guard checking your ID card

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization?.split(' ')[1];

    // If no token found - user is not logged in
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied! Please login first!' 
      });
    }

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user details for use in next function
    req.user = decoded;

    // Move to the next function
    next();

  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid token! Please login again!' 
    });
  }
};

// Check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied! Admins only!' 
    });
  }
  next();
};

// Check if user is staff
const staffOnly = (req, res, next) => {
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied! Staff only!' 
    });
  }
  next();
};

// Share these functions with other files
module.exports = { protect, adminOnly, staffOnly };