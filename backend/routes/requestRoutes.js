const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

const { 
  protect, 
  adminOnly, 
  staffOnly 
} = require('../middleware/authMiddleware');
router.get('/requests', protect, adminOnly, getAllRequests);

router.get('/requests/my/:username', protect, getMyRequests);

router.post('/requests', protect, staffOnly, [

  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')

], createRequest);
router.put('/requests/:id', protect, staffOnly, updateRequest);

router.delete('/requests/:id', protect, adminOnly, deleteRequest);

module.exports = router;