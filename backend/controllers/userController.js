const db = require("../config/database");
const { sendResponse } = require("../utils/response");
const logger = require("../utils/logger");

exports.followUser = (req, res, next) => {
  const { id } = req.params;
  if (parseInt(id) === req.user.id) {
    return sendResponse(res, 400, "Cannot follow yourself");
  }
  db.get(
    "SELECT * FROM follows WHERE followerId = ? AND followingId = ?",
    [req.user.id, id],
    (err, follow) => {
      if (err) {
        logger.error("Check follow error:", err);
        return next(err);
      }
      if (follow) {
        return sendResponse(res, 400, "Already following user");
      }
      db.run(
        "INSERT INTO follows (followerId, followingId) VALUES (?, ?)",
        [req.user.id, id],
        function (err) {
          if (err) {
            logger.error("Follow user error:", err);
            return next(err);
          }
          const io = req.app.get("io");
          io.to(`user-${id}`).emit("notification", {
            type: "follow",
            content: `${req.user.username} followed you`,
            relatedId: req.user.id,
          });
          db.run(
            "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
            [id, "follow", `${req.user.username} followed you`, req.user.id],
            (err) => {
              if (err) {
                logger.error("Insert notification error:", err);
              }
            }
          );
          sendResponse(res, 200, "User followed");
        }
      );
    }
  );
};

exports.getRecommendedUsers = (req, res, next) => {
  db.all(
    "SELECT u.id, u.username, u.avatar, u.bio FROM users u WHERE u.id != ? AND u.id NOT IN (SELECT followingId FROM follows WHERE followerId = ?) ORDER BY RANDOM() LIMIT 5",
    [req.user.id, req.user.id],
    (err, users) => {
      if (err) {
        logger.error("Fetch recommended users error:", err);
        return next(err);
      }
      sendResponse(res, 200, "Recommended users fetched", users);
    }
  );
};
