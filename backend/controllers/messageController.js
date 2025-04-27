const Message = require("../models/Message");

exports.getMessages = (req, res) => {
  const { receiverId } = req.query;
  if (!receiverId)
    return res.status(400).json({ error: "Receiver ID is required" });
  Message.findBetweenUsers(req.user.id, receiverId, (err, messages) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(messages);
  });
};

exports.getMessageById = (req, res) => {
  const { id } = req.params;
  Message.findById(id, (err, message) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (
      message.senderId !== req.user.id &&
      message.receiverId !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    res.json(message);
  });
};

exports.createMessage = (req, res) => {
  const { receiverId, text } = req.body;
  if (!receiverId || !text)
    return res.status(400).json({ error: "Receiver ID and text are required" });
  Message.create(req.user.id, receiverId, text, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Message sent" });
  });
};

exports.updateMessage = (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  Message.update(id, req.user.id, text, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.changes === 0)
      return res
        .status(404)
        .json({ error: "Message not found or unauthorized" });
    res.json({ message: "Message updated" });
  });
};

exports.deleteMessage = (req, res) => {
  const { id } = req.params;
  Message.delete(id, req.user.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.changes === 0)
      return res
        .status(404)
        .json({ error: "Message not found or unauthorized" });
    res.json({ message: "Message deleted" });
  });
};
