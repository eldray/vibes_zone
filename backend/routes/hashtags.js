const express = require("express");
const router = express.Router();
const {
  getTrendingHashtags,
  getHashtagPosts,
} = require("../controllers/hashtagController");

router.get("/", getTrendingHashtags);
router.get("/:name", getHashtagPosts);

module.exports = router;
