const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const db = require("./database");
const logger = require("../utils/logger");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    if (err) {
      logger.error("Deserialize user error:", err);
      return done(err);
    }
    done(null, user);
  });
});

// Local Strategy
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        logger.error("Local strategy error:", err);
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          logger.error("Bcrypt compare error:", err);
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: "Invalid email or password" });
      });
    });
  })
);

// JWT Strategy
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "your-jwt-secret",
    },
    (jwt_payload, done) => {
      db.get(
        "SELECT * FROM users WHERE id = ?",
        [jwt_payload.id],
        (err, user) => {
          if (err) {
            logger.error("JWT strategy error:", err);
            return done(err);
          }
          if (user) {
            return done(null, user);
          }
          logger.warn(`No user found for JWT payload ID: ${jwt_payload.id}`);
          return done(null, false);
        }
      );
    }
  )
);

// Google Strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      db.get(
        "SELECT * FROM users WHERE googleId = ? OR email = ?",
        [profile.id, profile.emails[0].value],
        (err, user) => {
          if (err) {
            logger.error("Google strategy error:", err);
            return done(err);
          }
          if (user) {
            return done(null, user);
          }
          const newUser = {
            email: profile.emails[0].value,
            username: profile.displayName.replace(/\s/g, "").toLowerCase(),
            googleId: profile.id,
            avatar: profile.photos[0].value,
          };
          db.run(
            "INSERT INTO users (email, username, googleId, avatar) VALUES (?, ?, ?, ?)",
            [newUser.email, newUser.username, newUser.googleId, newUser.avatar],
            function (err) {
              if (err) {
                logger.error("Google strategy insert error:", err);
                return done(err);
              }
              newUser.id = this.lastID;
              return done(null, newUser);
            }
          );
        }
      );
    }
  )
);

// Facebook Strategy
passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "emails", "displayName", "photos"],
    },
    (accessToken, refreshToken, profile, done) => {
      db.get(
        "SELECT * FROM users WHERE facebookId = ? OR email = ?",
        [profile.id, profile.emails?.[0]?.value],
        (err, user) => {
          if (err) {
            logger.error("Facebook strategy error:", err);
            return done(err);
          }
          if (user) {
            return done(null, user);
          }
          const newUser = {
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
            username: profile.displayName.replace(/\s/g, "").toLowerCase(),
            facebookId: profile.id,
            avatar: profile.photos?.[0]?.value,
          };
          db.run(
            "INSERT INTO users (email, username, facebookId, avatar) VALUES (?, ?, ?, ?)",
            [
              newUser.email,
              newUser.username,
              newUser.facebookId,
              newUser.avatar,
            ],
            function (err) {
              if (err) {
                logger.error("Facebook strategy insert error:", err);
                return done(err);
              }
              newUser.id = this.lastID;
              return done(null, newUser);
            }
          );
        }
      );
    }
  )
);

module.exports = passport;
