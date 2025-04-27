const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const validateId = require("../middleware/validateId");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

router.get("/", auth, messageController.getMessages);
router.get("/:id", auth, validateId, messageController.getMessageById);
router.post("/", auth, limiter, messageController.createMessage);
router.put("/:id", auth, validateId, messageController.updateMessage);
router.delete("/:id", auth, validateId, messageController.deleteMessage);

module.exports = router;
