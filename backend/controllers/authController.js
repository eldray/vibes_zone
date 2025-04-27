const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const passport = require("passport");
const { sendResponse } = require("../utils/response");
const { validateRegister, validateLogin } = require("../utils/validator");
const logger = require("../utils/logger");

exports.register = async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) return sendResponse(res, 400, error.details[0].message);

  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return sendResponse(res, 400, "Email or username already exists");
          }
          logger.error("Registration error:", err);
          return next(err);
        }
        db.get(
          "SELECT id, email, username, avatar, bio FROM users WHERE id = ?",
          [this.lastID],
          (err, user) => {
            if (err) {
              logger.error("Fetch user after registration error:", err);
              return next(err);
            }
            const token = jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET || "your-jwt-secret",
              {
                expiresIn: "1d",
              }
            );
            sendResponse(res, 201, "User registered", { user, token });
          }
        );
      }
    );
  } catch (err) {
    logger.error("Registration error:", err);
    next(err);
  }
};

exports.login = (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) return sendResponse(res, 400, error.details[0].message);

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      logger.error("Login error:", err);
      return next(err);
    }
    if (!user) return sendResponse(res, 401, info.message);
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-jwt-secret",
      {
        expiresIn: "1d",
      }
    );
    sendResponse(res, 200, "Login successful", { user, token });
  })(req, res, next);
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = passport.authenticate(
  "google",
  { session: false },
  (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, "Google authentication failed");
    }
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET || "your-jwt-secret",
      {
        expiresIn: "1d",
      }
    );
    res.redirect(`http://localhost:3000/?page=auth&token=${token}`);
  }
);

exports.facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

exports.facebookCallback = passport.authenticate(
  "facebook",
  { session: false },
  (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, "Facebook authentication failed");
    }
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET || "your-jwt-secret",
      {
        expiresIn: "1d",
      }
    );
    res.redirect(`http://localhost:3000/?page=auth&token=${token}`);
  }
);

exports.getProfile = (req, res) => {
  sendResponse(res, 200, "Profile fetched", {
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar,
    bio: req.user.bio,
  });
};

exports.updateProfile = async (req, res, next) => {
  const { username, bio } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : req.user.avatar;
  try {
    db.run(
      "UPDATE users SET username = ?, bio = ?, avatar = ? WHERE id = ?",
      [username || req.user.username, bio || req.user.bio, avatar, req.user.id],
      (err) => {
        if (err) {
          logger.error("Profile update error:", err);
          return next(err);
        }
        db.get(
          "SELECT id, email, username, avatar, bio FROM users WHERE id = ?",
          [req.user.id],
          (err, user) => {
            if (err) {
              logger.error("Fetch user after update error:", err);
              return next(err);
            }
            sendResponse(res, 200, "Profile updated", user);
          }
        );
      }
    );
  } catch (err) {
    logger.error("Profile update error:", err);
    next(err);
  }
};
