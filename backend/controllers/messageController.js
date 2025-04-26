const db = require("../config/database");

exports.getMessages = (req, res) => {
  const { receiverId } = req.query;
  db.all(
    "SELECT m.*, u.username AS senderUsername FROM messages m JOIN users u ON m.senderId = u.id WHERE (m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?)",
    [req.user.id, receiverId, receiverId, req.user.id],
    (err, messages) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(messages);
    }
  );
};
