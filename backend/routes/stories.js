const express = require("express");
const router = express.Router();
const { createStory, getStories } = require("../controllers/storyController");
const authMiddleware = require("../middleware/auth");
const upload = require("../config/multer");

router.post("/", authMiddleware, upload.single("media"), createStory);
router.get("/", authMiddleware, getStories);

module.exports = router;
