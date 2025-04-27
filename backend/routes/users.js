const express = require("express");
const router = express.Router();
const {
  followUser,
  getRecommendedUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.post("/:id/follow", authMiddleware, followUser);
router.get("/recommended", authMiddleware, getRecommendedUsers);

module.exports = router;
