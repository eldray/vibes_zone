const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth.html" }),
  authController.socialCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth.html" }),
  authController.socialCallback
);

module.exports = router;
