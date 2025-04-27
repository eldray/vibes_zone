const db = require("../config/database");
const { sendResponse } = require("../utils/response");

exports.createStory = async (req, res, next) => {
  const { duration = 24 } = req.body; // Duration in hours
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
  if (!mediaUrl) return sendResponse(res, 400, "Media file required");
  const expiresAt = new Date(
    Date.now() + duration * 60 * 60 * 1000
  ).toISOString();
  try {
    db.run(
      "INSERT INTO stories (userId, imageUrl, videoUrl, expiresAt) VALUES (?, ?, ?, ?)",
      [
        req.user.id,
        req.file.mimetype.startsWith("image") ? mediaUrl : null,
        req.file.mimetype.startsWith("video") ? mediaUrl : null,
        expiresAt,
      ],
      function (err) {
        if (err) return next(err);
        db.get(
          "SELECT * FROM stories WHERE id = ?",
          [this.lastID],
          (err, story) => {
            if (err) return next(err);
            sendResponse(res, 201, "Story created", story);
          }
        );
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getStories = (req, res, next) => {
  db.all(
    "SELECT s.*, u.username, u.avatar FROM stories s JOIN users u ON s.userId = u.id WHERE s.expiresAt > ? ORDER BY s.createdAt DESC",
    [new Date().toISOString()],
    (err, stories) => {
      if (err) return next(err);
      sendResponse(res, 200, "Stories fetched", stories);
    }
  );
};
