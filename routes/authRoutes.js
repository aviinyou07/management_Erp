const express = require("express");
const passport = require("passport");
const pool = require("../config/db");

const {
  signup,
  login,
  refreshTokenController,
  logout,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/tokenUtils");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
  async (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user);
      const refreshToken = generateRefreshToken(req.user);

      await pool.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
        refreshToken,
        req.user.id
      ]);

      return res.redirect(
        `${process.env.FRONTEND_URL}/social-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

// Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook")
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
  async (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user);
      const refreshToken = generateRefreshToken(req.user);

      await pool.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
        refreshToken,
        req.user.id
      ]);

      return res.redirect(
        `${process.env.FRONTEND_URL}/social-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      console.error("Facebook callback error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

module.exports = router;