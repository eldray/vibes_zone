const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");

router.get("/", postController.getPosts);
router.get("/:id", validateId, postController.getPostById);
router.post("/", auth, postController.createPost);
router.put("/:id", auth, validateId, postController.updatePost);
router.delete("/:id", auth, validateId, postController.deletePost);

module.exports = router;
