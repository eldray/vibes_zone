const express = require("express");
const auth = require("../middleware/auth");
const db = require("../config/database");
const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

const router = express.Router();

// Get all posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM posts ORDER BY createdAt DESC", [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    sendResponse(res, 200, "Posts retrieved", posts);
  } catch (err) {
    logger.error("Error fetching posts:", err);
    sendResponse(res, 500, "Error fetching posts", null, err.message);
  }
});

// Create a post
router.post("/", auth, async (req, res) => {
  const { content, imageUrl, videoUrl, hashtags } = req.body;
  try {
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO posts (userId, content, imageUrl, videoUrl, hashtags) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, content, imageUrl, videoUrl, hashtags],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
    sendResponse(res, 201, "Post created");
  } catch (err) {
    logger.error("Error creating post:", err);
    sendResponse(res, 400, "Error creating post", null, err.message);
  }
});

module.exports = router;
