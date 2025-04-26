const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../../vibezone.sqlite"),
  (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
      // Create tables
      db.serialize(() => {
        db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);
        db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          content TEXT,
          imageUrl TEXT,
          likes INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);
        db.run(`
        CREATE TABLE IF NOT EXISTS reels (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          videoUrl TEXT NOT NULL,
          description TEXT,
          likes INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0,
          duration TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);
        db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          senderId INTEGER,
          receiverId INTEGER,
          text TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (senderId) REFERENCES users(id),
          FOREIGN KEY (receiverId) REFERENCES users(id)
        )
      `);
      });
    }
  }
);

module.exports = db;
