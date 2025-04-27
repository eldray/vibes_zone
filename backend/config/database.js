const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const logger = require("../utils/logger");

const dbPath = path.resolve(
  __dirname,
  "../db",
  process.env.SQLITE_DB_PATH || "database.sqlite"
);
logger.info(`Resolved database path: ${dbPath}`); // Debug path

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error("Database connection error:", err);
    throw err;
  } else {
    logger.info("Connected to SQLite database at " + dbPath);
  }
});

db.serialize(() => {
  // Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT,
      avatar TEXT,
      bio TEXT,
      googleId TEXT,
      facebookId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Posts
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      content TEXT,
      imageUrl TEXT,
      videoUrl TEXT,
      hashtags TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Reels
  db.run(`
    CREATE TABLE IF NOT EXISTS reels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoUrl TEXT NOT NULL,
      description TEXT,
      hashtags TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Messages
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senderId INTEGER NOT NULL,
      receiverId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senderId) REFERENCES users(id),
      FOREIGN KEY (receiverId) REFERENCES users(id)
    )
  `);

  // Stories
  db.run(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      imageUrl TEXT,
      videoUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Likes
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER,
      reelId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (reelId) REFERENCES reels(id),
      UNIQUE(userId, postId, reelId)
    )
  `);

  // Comments
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER,
      reelId INTEGER,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (reelId) REFERENCES reels(id)
    )
  `);

  // Shares
  db.run(`
    CREATE TABLE IF NOT EXISTS shares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER,
      reelId INTEGER,
      type TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (reelId) REFERENCES reels(id)
    )
  `);

  // Hashtags
  db.run(`
    CREATE TABLE IF NOT EXISTS hashtags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      postCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Notifications
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      relatedId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Follows
  db.run(`
    CREATE TABLE IF NOT EXISTS follows (
      followerId INTEGER NOT NULL,
      followingId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (followerId, followingId),
      FOREIGN KEY (followerId) REFERENCES users(id),
      FOREIGN KEY (followingId) REFERENCES users(id)
    )
  `);

  // Sessions
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expire DATETIME NOT NULL
    )
  `);
});

module.exports = db;
