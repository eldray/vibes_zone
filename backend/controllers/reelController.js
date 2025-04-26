const db = require("../config/database");
const path = require("path");

exports.uploadReel = (req, res) => {
  const { description, duration } = req.body;
  const videoUrl = `/uploads/${req.file.filename}`;

  db.run(
    "INSERT INTO reels (userId, videoUrl, description, duration) VALUES (?, ?, ?, ?)",
    [req.user.id, videoUrl, description, duration],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        videoUrl,
        description,
        duration,
        userId: req.user.id,
      });
    }
  );
};

exports.getReels = (req, res) => {
  db.all(
    "SELECT r.*, u.username FROM reels r JOIN users u ON r.userId = u.id ORDER BY r.createdAt DESC",
    [],
    (err, reels) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(reels);
    }
  );
};
