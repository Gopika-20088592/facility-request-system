const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('facility.db');

app.use(cors());
app.use(express.json());

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_by TEXT,
    date TEXT DEFAULT (datetime('now'))
  );
`);

// ==================
// REQUEST ROUTES
// ==================

// GET - fetch all requests
app.get('/requests', (req, res) => {
  const requests = db.prepare('SELECT * FROM requests WHERE status != "Deleted"').all();
  res.json(requests);
});

// POST - create a new request
app.post('/requests', (req, res) => {
  const { title, description, created_by } = req.body;
  const result = db.prepare(
    'INSERT INTO requests (title, description, created_by) VALUES (?, ?, ?)'
  ).run(title, description, created_by);
  res.json({ id: result.lastInsertRowid, message: 'Request created!' });
});

// PUT - update request status
app.put('/requests/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Updated!' });
});

// DELETE - soft delete
app.delete('/requests/:id', (req, res) => {
  db.prepare('UPDATE requests SET status = "Deleted" WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted!' });
});

// ==================
// USER ROUTES
// ==================

// POST - Register
app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  try {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .run(username, password, role || 'user');
    res.json({ message: 'User registered!' });
  } catch (err) {
    res.status(400).json({ message: 'Username already exists!' });
  }
});

// POST - Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
    .get(username, password);
  if (user) {
    res.json({ message: 'Login successful!', user });
  } else {
    res.status(401).json({ message: 'Invalid username or password!' });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));