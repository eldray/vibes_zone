const express = require("express");
const router = express.Router();
const liveController = require("../controllers/liveController");

router.get("/", authMiddleware, liveController.getLiveStreams);

module.exports = router;
