const db = require("../config/database");

const Message = {
  create: (senderId, receiverId, text, callback) => {
    db.run(
      "INSERT INTO messages (senderId, receiverId, text) VALUES (?, ?, ?)",
      [senderId, receiverId, text],
      function (err) {
        callback(err, this);
      }
    );
  },

  findBetweenUsers: (userId1, userId2, callback) => {
    db.all(
      "SELECT m.*, u.username AS senderUsername FROM messages m JOIN users u ON m.senderId = u.id WHERE (m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?) ORDER BY m.timestamp ASC",
      [userId1, userId2, userId2, userId1],
      callback
    );
  },

  findById: (id, callback) => {
    db.get(
      "SELECT m.*, u.username AS senderUsername FROM messages m JOIN users u ON m.senderId = u.id WHERE m.id = ?",
      [id],
      callback
    );
  },

  update: (id, senderId, text, callback) => {
    db.run(
      "UPDATE messages SET text = ? WHERE id = ? AND senderId = ?",
      [text, id, senderId],
      function (err) {
        callback(err, this);
      }
    );
  },

  delete: (id, senderId, callback) => {
    db.run(
      "DELETE FROM messages WHERE id = ? AND senderId = ?",
      [id, senderId],
      function (err) {
        callback(err, this);
      }
    );
  },
};

module.exports = Message;
