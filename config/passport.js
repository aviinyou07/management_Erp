const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const fullName = profile.displayName || "Google User";
        const profilePicture = profile.photos?.[0]?.value || null;

        const [googleUsers] = await pool.execute(
          "SELECT * FROM users WHERE google_id = ?",
          [googleId]
        );

        if (googleUsers.length > 0) {
          return done(null, googleUsers[0]);
        }

        if (email) {
          const [emailUsers] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );

          if (emailUsers.length > 0) {
            await pool.execute(
              "UPDATE users SET google_id = ?, profile_picture = ? WHERE id = ?",
              [googleId, profilePicture, emailUsers[0].id]
            );

            const [updatedUsers] = await pool.execute(
              "SELECT * FROM users WHERE id = ?",
              [emailUsers[0].id]
            );

            return done(null, updatedUsers[0]);
          }
        }

        const [result] = await pool.execute(
          `INSERT INTO users (full_name, email, user_type, google_id, profile_picture, is_verified)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [fullName, email, "GUEST", googleId, profilePicture, true]
        );

        const [newUsers] = await pool.execute(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId]
        );

        return done(null, newUsers[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const facebookId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const fullName = profile.displayName || "Facebook User";
        const profilePicture = profile.photos?.[0]?.value || null;

        const [facebookUsers] = await pool.execute(
          "SELECT * FROM users WHERE facebook_id = ?",
          [facebookId]
        );

        if (facebookUsers.length > 0) {
          return done(null, facebookUsers[0]);
        }

        if (email) {
          const [emailUsers] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );

          if (emailUsers.length > 0) {
            await pool.execute(
              "UPDATE users SET facebook_id = ?, profile_picture = ? WHERE id = ?",
              [facebookId, profilePicture, emailUsers[0].id]
            );

            const [updatedUsers] = await pool.execute(
              "SELECT * FROM users WHERE id = ?",
              [emailUsers[0].id]
            );

            return done(null, updatedUsers[0]);
          }
        }

        const [result] = await pool.execute(
          `INSERT INTO users (full_name, email, user_type, facebook_id, profile_picture, is_verified)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [fullName, email, "GUEST", facebookId, profilePicture, true]
        );

        const [newUsers] = await pool.execute(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId]
        );

        return done(null, newUsers[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;