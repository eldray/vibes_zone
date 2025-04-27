const db = require("../config/database");
const { sendResponse } = require("../utils/response");

exports.getNotifications = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.all(
    "SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?",
    [req.user.id, limit, offset],
    (err, notifications) => {
      if (err) return next(err);
      sendResponse(res, 200, "Notifications fetched", notifications);
    }
  );
};
