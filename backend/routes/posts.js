const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");

router.get("/", postController.getPosts);
router.post("/", auth, postController.createPost);

module.exports = router;
