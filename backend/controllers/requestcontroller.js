// This file handles all request related logic
// Create, View, Update and Delete requests

const db = require('../models/db');

// GET - Get all requests from database
const getAllRequests = (req, res) => {
  // Fetch all requests that are not deleted
  const requests = db.prepare(
    'SELECT * FROM requests WHERE status != "Deleted"'
  ).all();

  res.json(requests);
};

// GET - Get requests by a specific user
const getMyRequests = (req, res) => {
  // Get username from the URL
  const { username } = req.params;

  // Fetch only this user's requests
  const requests = db.prepare(
    'SELECT * FROM requests WHERE created_by = ? AND status != "Deleted"'
  ).all(username);

  res.json(requests);
};

// POST - Create a new request
const createRequest = (req, res) => {
  // Get title, description and username from the form
  const { title, description, created_by } = req.body;

  // Check if all fields are filled
  if (!title || !description || !created_by) {
    return res.status(400).json({ message: 'Please fill all fields!' });
  }

  // Save request to database
  db.prepare(
    'INSERT INTO requests (title, description, created_by) VALUES (?, ?, ?)'
  ).run(title, description, created_by);

  res.json({ message: 'Request created successfully!' });
};

// PUT - Update request status
const updateRequest = (req, res) => {
  // Get the new status from the request
  const { status } = req.body;

  // Get request id from the URL
  const { id } = req.params;

  // Update the status in database
  db.prepare(
    'UPDATE requests SET status = ? WHERE id = ?'
  ).run(status, id);

  res.json({ message: 'Request updated successfully!' });
};

// DELETE - Delete a request
const deleteRequest = (req, res) => {
  // Get request id from the URL
  const { id } = req.params;

  // Soft delete - just change status to Deleted
  db.prepare(
    'UPDATE requests SET status = "Deleted" WHERE id = ?'
  ).run(id);

  res.json({ message: 'Request deleted successfully!' });
};

// Share these functions with other files
module.exports = {
  getAllRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest
};