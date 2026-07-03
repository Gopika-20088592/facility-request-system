const Request = require('../models/Request');
const { validationResult } = require('express-validator');

const getAllRequests = async (req, res) => {
  try {
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

const createRequest = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  const { title, description, created_by, created_by_role, raised_for } = req.body;

  try {
    const newRequest = new Request({
      title,
      description,
      created_by,
      created_by_role,
      raised_for: raised_for || '',
      status: 'New'
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ 
        message: 'Please provide a reason for the status change!' 
      });
    }
    await Request.findByIdAndUpdate(
      req.params.id,
      { status, reason },
      { new: true }
    );

    res.json({ message: 'Request updated successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

const deleteRequest = async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again!' });
  }
};

module.exports = {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest
};