// This file sets up the URLs for all request actions
// Think of it like a menu that lists all available actions

const express = require('express');
const router = express.Router();

// Import all functions from request controller
const {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

// When someone goes to /requests - get all requests
router.get('/requests', getAllRequests);

// When someone goes to /requests/my/username - get only their requests
router.get('/requests/my/:username', getMyRequests);

// When someone submits a new request - create it
router.post('/requests', createRequest);

// When someone updates a request status - update it
router.put('/requests/:id', updateRequest);

// When someone deletes a request - delete it
router.delete('/requests/:id', deleteRequest);

// Share these routes with server.js
module.exports = router;