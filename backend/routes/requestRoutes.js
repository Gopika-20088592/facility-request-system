// This file sets up all the URLs for facility requests
// It also protects routes using our auth middleware

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller functions
const {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

// Import middleware for protection
const { 
  protect, 
  adminOnly, 
  staffOnly 
} = require('../middleware/authMiddleware');

// GET - Admin gets all requests (protected - admin only)
router.get('/requests', protect, adminOnly, getAllRequests);

// GET - User gets their own requests (protected)
router.get('/requests/my/:username', protect, getMyRequests);

// POST - Staff creates new request (protected - staff only)
router.post('/requests', protect, staffOnly, [
  // Check title is not empty
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  // Check description is not empty
  body('description')
    .notEmpty()
    .withMessage('Description is required')

], createRequest);

// PUT - Update request status (protected - staff and admin)
router.put('/requests/:id', protect, staffOnly, updateRequest);

// DELETE - Delete request (protected - admin only)
router.delete('/requests/:id', protect, adminOnly, deleteRequest);

// Share these routes with server.js
module.exports = router;