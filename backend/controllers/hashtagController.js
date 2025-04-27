const db = require("../config/database");
const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

const getTrendingHashtags = async (req, res) => {
  try {
    const hashtags = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM hashtags ORDER BY postCount DESC LIMIT 10",
        [],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
    sendResponse(res, 200, "Trending hashtags retrieved", hashtags);
  } catch (err) {
    logger.error("Error fetching hashtags:", err);
    sendResponse(res, 500, "Error fetching hashtags", null, err.message);
  }
};

const getHashtagPosts = async (req, res) => {
  const { name } = req.params;
  try {
    const posts = await new Promise((resolve, reject) => {
      db.all(
        "SELECT p.* FROM posts p WHERE p.hashtags LIKE ? ORDER BY createdAt DESC",
        [`%${name}%`],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
    sendResponse(res, 200, `Posts for hashtag #${name} retrieved`, posts);
  } catch (err) {
    logger.error(`Error fetching posts for hashtag ${name}:`, err);
    sendResponse(res, 500, "Error fetching posts", null, err.message);
  }
};

module.exports = {
  getTrendingHashtags,
  getHashtagPosts,
};
