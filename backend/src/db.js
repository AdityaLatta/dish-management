const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'dishes.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create dishes table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS dishes (
    dishId      TEXT PRIMARY KEY,
    dishName    TEXT NOT NULL,
    imageUrl    TEXT NOT NULL,
    isPublished INTEGER NOT NULL DEFAULT 0
  );
`);

module.exports = db;
