const db = require("../config/database");
const { sendResponse } = require("../utils/response");
const { validateReel, validateComment } = require("../utils/validator");
const logger = require("../utils/logger");

exports.createReel = async (req, res, next) => {
  const { error } = validateReel(req.body);
  if (error) return sendResponse(res, 400, error.details[0].message);

  const { description, hashtags } = req.body;
  const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  if (!videoUrl) return sendResponse(res, 400, "Video file required");
  try {
    db.run(
      "INSERT INTO reels (userId, videoUrl, description, hashtags) VALUES (?, ?, ?, ?)",
      [req.user.id, videoUrl, description, hashtags],
      function (err) {
        if (err) {
          logger.error("Create reel error:", err);
          return next(err);
        }
        db.get(
          "SELECT r.*, u.username, u.avatar FROM reels r JOIN users u ON r.userId = u.id WHERE r.id = ?",
          [this.lastID],
          (err, reel) => {
            if (err) {
              logger.error("Fetch reel error:", err);
              return next(err);
            }
            sendResponse(res, 201, "Reel created", reel);
          }
        );
      }
    );
  } catch (err) {
    logger.error("Create reel error:", err);
    next(err);
  }
};

exports.getReels = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.all(
    "SELECT r.*, u.username, u.avatar FROM reels r JOIN users u ON r.userId = u.id ORDER BY r.createdAt DESC LIMIT ? OFFSET ?",
    [parseInt(limit), offset],
    (err, reels) => {
      if (err) {
        logger.error("Fetch reels error:", err);
        return next(err);
      }
      sendResponse(res, 200, "Reels fetched", reels);
    }
  );
};

exports.getReel = (req, res, next) => {
  db.get(
    "SELECT r.*, u.username, u.avatar FROM reels r JOIN users u ON r.userId = u.id WHERE r.id = ?",
    [req.params.id],
    (err, reel) => {
      if (err) {
        logger.error("Fetch reel error:", err);
        return next(err);
      }
      if (!reel) return sendResponse(res, 404, "Reel not found");
      sendResponse(res, 200, "Reel fetched", reel);
    }
  );
};

exports.likeReel = (req, res, next) => {
  db.get(
    "SELECT * FROM likes WHERE userId = ? AND reelId = ?",
    [req.user.id, req.params.id],
    (err, like) => {
      if (err) {
        logger.error("Check like error:", err);
        return next(err);
      }
      if (like) return sendResponse(res, 400, "Reel already liked");
      db.run(
        "INSERT INTO likes (userId, reelId) VALUES (?, ?)",
        [req.user.id, req.params.id],
        function (err) {
          if (err) {
            logger.error("Like reel error:", err);
            return next(err);
          }
          db.get(
            "SELECT COUNT(*) as count FROM likes WHERE reelId = ?",
            [req.params.id],
            (err, result) => {
              if (err) {
                logger.error("Count likes error:", err);
                return next(err);
              }
              db.get(
                "SELECT userId FROM reels WHERE id = ?",
                [req.params.id],
                (err, reel) => {
                  if (err) {
                    logger.error("Fetch reel owner error:", err);
                    return next(err);
                  }
                  const io = req.app.get("io");
                  io.emit("reelLiked", {
                    reelId: req.params.id,
                    count: result.count,
                  });
                  if (reel.userId !== req.user.id) {
                    db.run(
                      "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
                      [
                        reel.userId,
                        "like",
                        `${req.user.username} liked your reel`,
                        req.params.id,
                      ],
                      (err) => {
                        if (err) {
                          logger.error("Insert notification error:", err);
                        }
                        io.to(`user-${reel.userId}`).emit("notification", {
                          type: "like",
                          content: `${req.user.username} liked your reel`,
                          relatedId: req.params.id,
                        });
                      }
                    );
                  }
                  sendResponse(res, 200, "Reel liked", { count: result.count });
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.unlikeReel = (req, res, next) => {
  db.run(
    "DELETE FROM likes WHERE userId = ? AND reelId = ?",
    [req.user.id, req.params.id],
    function (err) {
      if (err) {
        logger.error("Unlike reel error:", err);
        return next(err);
      }
      if (this.changes === 0) return sendResponse(res, 400, "Reel not liked");
      db.get(
        "SELECT COUNT(*) as count FROM likes WHERE reelId = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            logger.error("Count likes error:", err);
            return next(err);
          }
          const io = req.app.get("io");
          io.emit("reelLiked", {
            reelId: req.params.id,
            count: result.count,
          });
          sendResponse(res, 200, "Reel unliked", { count: result.count });
        }
      );
    }
  );
};

exports.addComment = (req, res, next) => {
  const { error } = validateComment(req.body);
  if (error) return sendResponse(res, 400, error.details[0].message);

  const { content } = req.body;
  db.run(
    "INSERT INTO comments (userId, reelId, content) VALUES (?, ?, ?)",
    [req.user.id, req.params.id, content],
    function (err) {
      if (err) {
        logger.error("Add comment error:", err);
        return next(err);
      }
      db.get(
        "SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.userId = u.id WHERE c.id = ?",
        [this.lastID],
        (err, comment) => {
          if (err) {
            logger.error("Fetch comment error:", err);
            return next(err);
          }
          db.get(
            "SELECT userId FROM reels WHERE id = ?",
            [req.params.id],
            (err, reel) => {
              if (err) {
                logger.error("Fetch reel owner error:", err);
                return next(err);
              }
              const io = req.app.get("io");
              io.emit("newComment", { reelId: req.params.id, comment });
              if (reel.userId !== req.user.id) {
                db.run(
                  "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
                  [
                    reel.userId,
                    "comment",
                    `${req.user.username} commented on your reel`,
                    req.params.id,
                  ],
                  (err) => {
                    if (err) {
                      logger.error("Insert notification error:", err);
                    }
                    io.to(`user-${reel.userId}`).emit("notification", {
                      type: "comment",
                      content: `${req.user.username} commented on your reel`,
                      relatedId: req.params.id,
                    });
                  }
                );
              }
              sendResponse(res, 201, "Comment added", comment);
            }
          );
        }
      );
    }
  );
};

exports.getComments = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.all(
    "SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.userId = u.id WHERE c.reelId = ? ORDER BY c.createdAt DESC LIMIT ? OFFSET ?",
    [req.params.id, parseInt(limit), offset],
    (err, comments) => {
      if (err) {
        logger.error("Fetch comments error:", err);
        return next(err);
      }
      sendResponse(res, 200, "Comments fetched", comments);
    }
  );
};

exports.shareReel = (req, res, next) => {
  const { type } = req.body;
  if (!["repost", "message", "external"].includes(type)) {
    return sendResponse(res, 400, "Invalid share type");
  }
  db.run(
    "INSERT INTO shares (userId, reelId, type) VALUES (?, ?, ?)",
    [req.user.id, req.params.id, type],
    function (err) {
      if (err) {
        logger.error("Share reel error:", err);
        return next(err);
      }
      db.get(
        "SELECT COUNT(*) as count FROM shares WHERE reelId = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            logger.error("Count shares error:", err);
            return next(err);
          }
          db.get(
            "SELECT userId FROM reels WHERE id = ?",
            [req.params.id],
            (err, reel) => {
              if (err) {
                logger.error("Fetch reel owner error:", err);
                return next(err);
              }
              const io = req.app.get("io");
              io.emit("reelShared", {
                reelId: req.params.id,
                count: result.count,
              });
              if (type === "repost") {
                db.run(
                  "INSERT INTO posts (userId, content, hashtags) VALUES (?, ?, ?)",
                  [req.user.id, `Shared reel #${req.params.id}`, "shared"],
                  (err) => {
                    if (err) {
                      logger.error("Create repost error:", err);
                      return next(err);
                    }
                  }
                );
              }
              if (reel.userId !== req.user.id) {
                db.run(
                  "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
                  [
                    reel.userId,
                    "share",
                    `${req.user.username} shared your reel`,
                    req.params.id,
                  ],
                  (err) => {
                    if (err) {
                      logger.error("Insert notification error:", err);
                    }
                    io.to(`user-${reel.userId}`).emit("notification", {
                      type: "share",
                      content: `${req.user.username} shared your reel`,
                      relatedId: req.params.id,
                    });
                  }
                );
              }
              sendResponse(res, 200, "Reel shared", { count: result.count });
            }
          );
        }
      );
    }
  );
};
