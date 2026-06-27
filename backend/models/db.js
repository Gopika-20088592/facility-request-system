// This file creates our database and tables
// Think of it like creating a filing cabinet with 2 drawers

const Database = require('better-sqlite3');

// Open or create the database file
const db = new Database('facility.db');

// DRAWER 1 - Users Table
// Stores all registered users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  )
`);

// DRAWER 2 - Requests Table
// Stores all facility requests
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_by TEXT NOT NULL,
    date TEXT DEFAULT (datetime('now'))
  )
`);

// Share this database with other files
module.exports = db;