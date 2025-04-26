const express = require("express");
const router = express.Router();
const multer = require("multer");
const reelController = require("../controllers/reelController");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/", auth, upload.single("video"), reelController.uploadReel);
router.get("/", reelController.getReels);

module.exports = router;
