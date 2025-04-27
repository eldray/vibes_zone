const db = require("../config/database");

const Post = {
  create: (userId, content, imageUrl, callback) => {
    db.run(
      "INSERT INTO posts (userId, content, imageUrl) VALUES (?, ?, ?)",
      [userId, content, imageUrl],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, userId, content, imageUrl });
      }
    );
  },

  findAll: ({ sort, category }, callback) => {
    let query =
      "SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id";
    const params = [];
    if (category && category !== "All") {
      query += " WHERE p.content LIKE ?";
      params.push(`%#${category}%`);
    }
    if (sort === "trending" || sort === "most_liked")
      query += " ORDER BY p.likes DESC";
    else if (sort === "newest") query += " ORDER BY p.createdAt DESC";
    db.all(query, params, callback);
  },

  findById: (id, callback) => {
    db.get(
      "SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id WHERE p.id = ?",
      [id],
      callback
    );
  },

  update: (id, userId, content, imageUrl, callback) => {
    db.run(
      "UPDATE posts SET content = ?, imageUrl = ? WHERE id = ? AND userId = ?",
      [content, imageUrl, id, userId],
      function (err) {
        callback(err, this);
      }
    );
  },

  delete: (id, userId, callback) => {
    db.run(
      "DELETE FROM posts WHERE id = ? AND userId = ?",
      [id, userId],
      function (err) {
        callback(err, this);
      }
    );
  },
};

module.exports = Post;
