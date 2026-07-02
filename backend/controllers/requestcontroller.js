// This file handles all facility request actions
// Create, Read, Update and Delete requests using MongoDB

const Request = require('../models/Request');
const { validationResult } = require('express-validator');

// GET - Get all requests (Admin only)
const getAllRequests = async (req, res) => {
  try {
    // Find all requests that are not deleted
    const requests = await Request.find()
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const { username } = req.params;

    // Find requests where user is the creator
    // OR where the request was raised for them by staff
    const requests = await Request.find({
      $or: [
        { created_by: username },
        { raised_for: username }
      ]
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

// POST - Create a new request
const createRequest = async (req, res) => {

  // Check if all inputs are valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  // Now also getting raised_for from the request body
  const { title, description, created_by, created_by_role, raised_for } = req.body;

  try {
    // Create new request in MongoDB
    // Status starts as New when first created
    const newRequest = new Request({
      title,
      description,
      created_by,
      created_by_role,
      raised_for: raised_for || '',
      status: 'New'
    });

    // Save request to database
    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

// PUT - Update request status
const updateRequest = async (req, res) => {
  try {
    const { status } = req.body;

    // Find request by ID and update status
    await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: 'Request updated successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

// DELETE - Delete a request (Admin only)
const deleteRequest = async (req, res) => {
  try {
    // Find request by ID and delete it
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

// Share these functions with other files
module.exports = {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest
};