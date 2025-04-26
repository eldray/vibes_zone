const db = require("../config/database");

exports.getPosts = (req, res) => {
  const { sort = "trending", category } = req.query;
  let query =
    "SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id";
  const params = [];

  if (category && category !== "All") {
    query += " WHERE p.content LIKE ?";
    params.push(`%#${category}%`);
  }

  if (sort === "trending") query += " ORDER BY p.likes DESC";
  else if (sort === "newest") query += " ORDER BY p.createdAt DESC";
  else if (sort === "most_liked") query += " ORDER BY p.likes DESC";

  db.all(query, params, (err, posts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(posts);
  });
};

exports.createPost = (req, res) => {
  const { content, imageUrl } = req.body;
  db.run(
    "INSERT INTO posts (userId, content, imageUrl) VALUES (?, ?, ?)",
    [req.user.id, content, imageUrl],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, content, imageUrl, userId: req.user.id });
    }
  );
};
