const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const db = require("./database");
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
      scope: ["profile", "email"], // Add scopes to retrieve profile and email
    },
    (accessToken, refreshToken, profile, done) => {
      const username = `google_${profile.id}`;
      const email = profile.emails && profile.emails[0]?.value; // Optional email
      const displayName =
        profile.displayName || profile.name?.givenName || username; // Fallback to username

      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (user) return done(null, user);
          const password = bcrypt.hashSync(profile.id, 8);
          db.run(
            "INSERT INTO users (username, password, email, displayName) VALUES (?, ?, ?, ?)",
            [username, password, email, displayName],
            function (err) {
              if (err) return done(err);
              done(null, { id: this.lastID, username, email, displayName });
            }
          );
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    (accessToken, refreshToken, profile, done) => {
      const username = `facebook_${profile.id}`;
      const email = profile.emails && profile.emails[0]?.value; // Optional email
      const displayName =
        profile.name?.givenName || profile.displayName || username; // Fallback to username

      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (user) return done(null, user);
          const password = bcrypt.hashSync(profile.id, 8);
          db.run(
            "INSERT INTO users (username, password, email, displayName) VALUES (?, ?, ?, ?)",
            [username, password, email, displayName],
            function (err) {
              if (err) return done(err);
              done(null, { id: this.lastID, username, email, displayName });
            }
          );
        }
      );
    }
  )
);
