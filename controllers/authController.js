const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/tokenUtils");

const {
  findUserByEmail,
  findUserByMobile,
  findUserByEmailOrMobile,
  findUserById,
  insertUser,
  updateRefreshToken,
  clearRefreshToken,
  findUserByIdAndRefreshToken,
  updateResetToken,
  findUserByResetToken,
  updatePasswordAfterReset
} = require("../repositories/authRepository");

const signup = async (req, res) => {
  try {
    const {
      full_name,
      email,
      country,
      gender,
      dob,
      user_type,
      mobile,
      password
    } = req.body || {};

    if (
      !full_name ||
      !email ||
      !country ||
      !gender ||
      !dob ||
      !user_type ||
      !mobile ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const allowedTypes = ["NRI", "PROFESSIONAL", "GUEST"];
    if (!allowedTypes.includes(user_type)) {
      return res.status(400).json({
        message: "Invalid user type"
      });
    }

    const existingUsers = await findUserByEmailOrMobile(email, mobile);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "Email or mobile already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await insertUser({
      full_name,
      email,
      country,
      gender,
      dob,
      user_type,
      mobile,
      password: hashedPassword
    });

    const users = await findUserById(result.insertId);
    const user = users[0];

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateRefreshToken(user.id, refreshToken);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        user_type: user.user_type
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Server error during signup"
    });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body || {};

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile and password are required"
      });
    }

    const users = await findUserByMobile(mobile);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses social login. Please continue with Google or Facebook."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateRefreshToken(user.id, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        user_type: user.user_type
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login"
    });
  }
};


const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required"
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const users = await findUserByIdAndRefreshToken(decoded.id, refreshToken);

    if (users.length === 0) {
      return res.status(403).json({
        message: "Invalid refresh token"
      });
    }

    const user = users[0];
    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req.body || {};

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    await clearRefreshToken(userId);

    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error during logout"
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const users = await findUserByEmail(email);

    if (users.length === 0) {
      return res.status(404).json({
        message: "No user found with this email"
      });
    }

    const user = users[0];

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await updateResetToken(user.id, resetToken, resetTokenExpiry);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Reset Your Password",
      `
        <h2>Password Reset</h2>
        <p>Hello ${user.full_name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `
    );

    return res.status(200).json({
      message: "Password reset link sent to your email"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Server error during forgot password"
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({
        message: "New password is required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const users = await findUserByResetToken(token, Date.now());

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await updatePasswordAfterReset(user.id, hashedPassword);

    return res.status(200).json({
      message: "Password reset successful"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Server error during reset password"
    });
  }
};

module.exports = {
  signup,
  login,
  refreshTokenController,
  logout,
  forgotPassword,
  resetPassword
};