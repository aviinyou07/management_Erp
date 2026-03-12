const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      user_type: user.user_type
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};