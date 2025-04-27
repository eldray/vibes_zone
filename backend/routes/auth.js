const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/database");
const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
        [email, username, hashedPassword],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    sendResponse(res, 200, "Registration successful", { token, user });
  } catch (err) {
    logger.error("Registration error:", err);
    sendResponse(res, 400, "Registration failed", null, err.message);
  }
});

// Login
router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      logger.error("Login error:", err || info.message);
      return sendResponse(res, 401, info?.message || "Login failed");
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    sendResponse(res, 200, "Login successful", { token, user });
  })(req, res);
});

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    res.redirect(`http://localhost:3000/?page=auth&token=${token}`);
  }
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    res.redirect(`http://localhost:3000/?page=auth&token=${token}`);
  }
);

module.exports = router;
