const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  create: (username, password, email, displayName, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.run(
      "INSERT INTO users (username, password, email, displayName) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, displayName],
      function (err) {
        if (err) return callback(err);
        const user = { id: this.lastID, username, email, displayName };
        callback(null, user);
      }
    );
  },

  findByUsername: (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], callback);
  },

  findById: (id, callback) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], callback);
  },
};

module.exports = User;
