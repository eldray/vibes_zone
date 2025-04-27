const db = require("../config/database");

const Reel = {
  create: (userId, videoUrl, description, duration, callback) => {
    db.run(
      "INSERT INTO reels (userId, videoUrl, description, duration) VALUES (?, ?, ?, ?)",
      [userId, videoUrl, description, duration],
      function (err) {
        if (err) return callback(err);
        callback(null, {
          id: this.lastID,
          userId,
          videoUrl,
          description,
          duration,
        });
      }
    );
  },

  findAll: (callback) => {
    db.all(
      "SELECT r.*, u.username FROM reels r JOIN users u ON r.userId = u.id ORDER BY r.createdAt DESC",
      callback
    );
  },

  findById: (id, callback) => {
    db.get(
      "SELECT r.*, u.username FROM reels r JOIN users u ON r.userId = u.id WHERE r.id = ?",
      [id],
      callback
    );
  },

  update: (id, userId, videoUrl, description, duration, callback) => {
    const updates = [];
    const params = [];
    if (videoUrl) {
      updates.push("videoUrl = ?");
      params.push(videoUrl);
    }
    if (description) {
      updates.push("description = ?");
      params.push(description);
    }
    if (duration) {
      updates.push("duration = ?");
      params.push(duration);
    }
    params.push(id, userId);
    if (updates.length === 0) return callback(new Error("No fields to update"));
    db.run(
      `UPDATE reels SET ${updates.join(", ")} WHERE id = ? AND userId = ?`,
      params,
      function (err) {
        callback(err, this);
      }
    );
  },

  delete: (id, userId, callback) => {
    db.run(
      "DELETE FROM reels WHERE id = ? AND userId = ?",
      [id, userId],
      function (err) {
        callback(err, this);
      }
    );
  },
};

module.exports = Reel;
