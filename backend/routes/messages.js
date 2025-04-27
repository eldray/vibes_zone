const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, sendMessage);
router.get("/:receiverId", authMiddleware, getMessages);

module.exports = router;
