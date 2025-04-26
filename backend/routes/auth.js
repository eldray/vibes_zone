const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/users", auth, (req, res) => {
  db.all(
    "SELECT id, username FROM users WHERE id != ?",
    [req.user.id],
    (err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(users);
    }
  );
});

module.exports = router;
