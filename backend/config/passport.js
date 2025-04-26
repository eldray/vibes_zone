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
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const username = `google_${profile.id}`;

      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (user) return done(null, user);
          const password = bcrypt.hashSync(profile.id, 8);
          db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password],
            function (err) {
              if (err) return done(err);
              done(null, { id: this.lastID, username });
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

      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (user) return done(null, user);
          const password = bcrypt.hashSync(profile.id, 8);
          db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password],
            function (err) {
              if (err) return done(err);
              done(null, { id: this.lastID, username });
            }
          );
        }
      );
    }
  )
);
