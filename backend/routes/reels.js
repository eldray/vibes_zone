const express = require("express");
const router = express.Router();
const {
  createReel,
  getReels,
  getReel,
  likeReel,
  unlikeReel,
  addComment,
  getComments,
  shareReel,
} = require("../controllers/reelController");
const authMiddleware = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");
const upload = require("../config/multer");

router.post("/", authMiddleware, upload.single("video"), createReel);
router.get("/", getReels);
router.get("/:id", getReel);
router.post("/:id/like", authMiddleware, rateLimit, likeReel);
router.delete("/:id/like", authMiddleware, rateLimit, unlikeReel);
router.post("/:id/comment", authMiddleware, rateLimit, addComment);
router.get("/:id/comments", getComments);
router.post("/:id/share", authMiddleware, rateLimit, shareReel);

module.exports = router;
