const db = require("../config/database");
const { sendResponse } = require("../utils/response");
const { validatePost, validateComment } = require("../utils/validator");
const logger = require("../utils/logger");

exports.createPost = async (req, res, next) => {
  const { error } = validatePost(req.body);
  if (error) return sendResponse(res, 400, error.details[0].message);

  const { content, hashtags } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    db.run(
      "INSERT INTO posts (userId, content, imageUrl, hashtags) VALUES (?, ?, ?, ?)",
      [req.user.id, content, imageUrl, hashtags],
      function (err) {
        if (err) {
          logger.error("Create post error:", err);
          return next(err);
        }
        db.get(
          "SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.userId = u.id WHERE p.id = ?",
          [this.lastID],
          (err, post) => {
            if (err) {
              logger.error("Fetch post error:", err);
              return next(err);
            }
            sendResponse(res, 201, "Post created", post);
          }
        );
      }
    );
  } catch (err) {
    logger.error("Create post error:", err);
    next(err);
  }
};

exports.getPosts = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.all(
    "SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.userId = u.id ORDER BY p.createdAt DESC LIMIT ? OFFSET ?",
    [parseInt(limit), offset],
    (err, posts) => {
      if (err) {
        logger.error("Fetch posts error:", err);
        return next(err);
      }
      sendResponse(res, 200, "Posts fetched", posts);
    }
  );
};

exports.getPost = (req, res, next) => {
  db.get(
    "SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.userId = u.id WHERE p.id = ?",
    [req.params.id],
    (err, post) => {
      if (err) {
        logger.error("Fetch post error:", err);
        return next(err);
      }
      if (!post) return sendResponse(res, 404, "Post not found");
      sendResponse(res, 200, "Post fetched", post);
    }
  );
};

exports.likePost = (req, res, next) => {
  db.get(
    "SELECT * FROM likes WHERE userId = ? AND postId = ?",
    [req.user.id, req.params.id],
    (err, like) => {
      if (err) {
        logger.error("Check like error:", err);
        return next(err);
      }
      if (like) return sendResponse(res, 400, "Post already liked");
      db.run(
        "INSERT INTO likes (userId, postId) VALUES (?, ?)",
        [req.user.id, req.params.id],
        function (err) {
          if (err) {
            logger.error("Like post error:", err);
            return next(err);
          }
          db.get(
            "SELECT COUNT(*) as count FROM likes WHERE postId = ?",
            [req.params.id],
            (err, result) => {
              if (err) {
                logger.error("Count likes error:", err);
                return next(err);
              }
              db.get(
                "SELECT userId FROM posts WHERE id = ?",
                [req.params.id],
                (err, post) => {
                  if (err) {
                    logger.error("Fetch post owner error:", err);
                    return next(err);
                  }
                  const io = req.app.get("io");
                  io.emit("postLiked", {
                    postId: req.params.id,
                    count: result.count,
                  });
                  if (post.userId !== req.user.id) {
                    db.run(
                      "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
                      [
                        post.userId,
                        "like",
                        `${req.user.username} liked your post`,
                        req.params.id,
                      ],
                      (err) => {
                        if (err) {
                          logger.error("Insert notification error:", err);
                        }
                        io.to(`user-${post.userId}`).emit("notification", {
                          type: "like",
                          content: `${req.user.username} liked your post`,
                          relatedId: req.params.id,
                        });
                      }
                    );
                  }
                  sendResponse(res, 200, "Post liked", { count: result.count });
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.unlikePost = (req, res, next) => {
  db.run(
    "DELETE FROM likes WHERE userId = ? AND postId = ?",
    [req.user.id, req.params.id],
    function (err) {
      if (err) {
        logger.error("Unlike post error:", err);
        return next(err);
      }
      if (this.changes === 0) return sendResponse(res, 400, "Post not liked");
      db.get(
        "SELECT COUNT(*) as count FROM likes WHERE postId = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            logger.error("Count likes error:", err);
            return next(err);
          }
          const io = req.app.get("io");
          io.emit("postLiked", {
            postId: req.params.id,
            count: result.count,
          });
          sendResponse(res, 200, "Post unliked", { count: result.count });
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
    "INSERT INTO comments (userId, postId, content) VALUES (?, ?, ?)",
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
            "SELECT userId FROM posts WHERE id = ?",
            [req.params.id],
            (err, post) => {
              if (err) {
                logger.error("Fetch post owner error:", err);
                return next(err);
              }
              const io = req.app.get("io");
              io.emit("newComment", { postId: req.params.id, comment });
              if (post.userId !== req.user.id) {
                db.run(
                  "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
                  [
                    post.userId,
                    "comment",
                    `${req.user.username} commented on your post`,
                    req.params.id,
                  ],
                  (err) => {
                    if (err) {
                      logger.error("Insert notification error:", err);
                    }
                    io.to(`user-${post.userId}`).emit("notification", {
                      type: "comment",
                      content: `${req.user.username} commented on your post`,
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
    "SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.userId = u.id WHERE c.postId = ? ORDER BY c.createdAt DESC LIMIT ? OFFSET ?",
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

exports.sharePost = (req, res, next) => {
  const { type } = req.body;
  if (!["repost", "message", "external"].includes(type)) {
    return sendResponse(res, 400, "Invalid share type");
  }
  db.run(
    "INSERT INTO shares (userId, postId, type) VALUES (?, ?, ?)",
    [req.user.id, req.params.id, type],
    function (err) {
      if (err) {
        logger.error("Share post error:", err);
        return next(err);
      }
      db.get(
        "SELECT COUNT(*) as count FROM shares WHERE postId = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            logger.error("Count shares error:", err);
            return next(err);
          }
          db.get(
            "SELECT userId FROM posts WHERE id = ?",
            [req.params.id],
            (err, post) => {
              if (err) {
                logger.error("Fetch post owner error:", err);
                return next(err);
              }
              const io = req.app.get("io");
              io.emit("postShared", {
                postId: req.params.id,
                count: result.count,
              });
              if (type === "repost") {
                db.run(
                  "INSERT INTO posts (userId, content, hashtags) VALUES (?, ?, ?)",
                  [req.user.id, `Shared post #${req.params.id}`, "shared"],
                  (err) => {
                    if (err) {
                      logger.error("Create repost error:", err);
                      return next(err);
                    }
                  }
                );
              }
              if (post.userId !== req.user.id) {
                db.run(
                  "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
                  [
                    post.userId,
                    "share",
                    `${req.user.username} shared your post`,
                    req.params.id,
                  ],
                  (err) => {
                    if (err) {
                      logger.error("Insert notification error:", err);
                    }
                    io.to(`user-${post.userId}`).emit("notification", {
                      type: "share",
                      content: `${req.user.username} shared your post`,
                      relatedId: req.params.id,
                    });
                  }
                );
              }
              sendResponse(res, 200, "Post shared", { count: result.count });
            }
          );
        }
      );
    }
  );
};
