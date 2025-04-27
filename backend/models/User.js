const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  // Create a new user with hashed password
  create: (username, password, email, displayName, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.run(
      "INSERT INTO users (username, password, email, displayName) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, displayName],
      function (err) {
        if (err) return callback(err);
        const user = {
          id: this.lastID,
          username,
          email,
          displayName,
        };
        callback(null, user);
      }
    );
  },

  // Find a user by username
  findByUsername: (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], callback);
  },

  // Find a user by ID
  findById: (id, callback) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], callback);
  },
};

module.exports = User;
