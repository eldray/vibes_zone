const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, eventController.getEvents);

module.exports = router;
