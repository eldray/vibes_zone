const db = require("../config/database");
const { sendResponse } = require("../utils/response");
const logger = require("../utils/logger");

exports.sendMessage = (req, res, next) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) {
    return sendResponse(res, 400, "Receiver ID and content required");
  }
  db.run(
    "INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)",
    [req.user.id, receiverId, content],
    function (err) {
      if (err) {
        logger.error("Send message error:", err);
        return next(err);
      }
      db.get(
        "SELECT m.*, u.username, u.avatar FROM messages m JOIN users u ON m.senderId = u.id WHERE m.id = ?",
        [this.lastID],
        (err, message) => {
          if (err) {
            logger.error("Fetch message error:", err);
            return next(err);
          }
          const io = req.app.get("io");
          io.to(`user-${receiverId}`).emit("newMessage", message);
          // Insert notification
          db.run(
            "INSERT INTO notifications (userId, type, content, relatedId) VALUES (?, ?, ?, ?)",
            [
              receiverId,
              "message",
              `${req.user.username} sent you a message`,
              message.id,
            ],
            (err) => {
              if (err) {
                logger.error("Insert notification error:", err);
              }
              io.to(`user-${receiverId}`).emit("notification", {
                type: "message",
                content: `${req.user.username} sent you a message`,
                relatedId: message.id,
              });
            }
          );
          sendResponse(res, 201, "Message sent", message);
        }
      );
    }
  );
};

exports.getMessages = (req, res, next) => {
  const { receiverId } = req.params;
  db.all(
    "SELECT m.*, u.username, u.avatar FROM messages m JOIN users u ON m.senderId = u.id WHERE (m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?) ORDER BY m.createdAt",
    [req.user.id, receiverId, receiverId, req.user.id],
    (err, messages) => {
      if (err) {
        logger.error("Fetch messages error:", err);
        return next(err);
      }
      sendResponse(res, 200, "Messages fetched", messages);
    }
  );
};
