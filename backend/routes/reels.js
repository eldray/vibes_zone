const express = require("express");
const router = express.Router();
const multer = require("multer");
const reelController = require("../controllers/reelController");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/", auth, upload.single("video"), reelController.uploadReel);
router.get("/", reelController.getReels);
router.get("/:id", validateId, reelController.getReelById);
router.put(
  "/:id",
  auth,
  validateId,
  upload.single("video"),
  reelController.updateReel
);
router.delete("/:id", auth, validateId, reelController.deleteReel);

module.exports = router;
