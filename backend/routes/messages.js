const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");

router.get("/", auth, messageController.getMessages);

module.exports = router;
