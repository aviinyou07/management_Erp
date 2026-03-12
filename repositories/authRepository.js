const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

const findUserByMobile = async (mobile) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE mobile = ?",
    [mobile]
  );
  return rows;
};

const findUserByEmailOrMobile = async (email, mobile) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ? OR mobile = ?",
    [email, mobile]
  );
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows;
};

const insertUser = async ({
  full_name,
  email,
  country,
  gender,
  dob,
  user_type,
  mobile,
  password
}) => {
  const [result] = await pool.execute(
    `INSERT INTO users
    (full_name, email, country, gender, dob, user_type, mobile, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, country, gender, dob, user_type, mobile, password]
  );
  return result;
};

const updateRefreshToken = async (userId, refreshToken) => {
  const [result] = await pool.execute(
    "UPDATE users SET refresh_token = ? WHERE id = ?",
    [refreshToken, userId]
  );
  return result;
};

const clearRefreshToken = async (userId) => {
  const [result] = await pool.execute(
    "UPDATE users SET refresh_token = NULL WHERE id = ?",
    [userId]
  );
  return result;
};

const findUserByIdAndRefreshToken = async (userId, refreshToken) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE id = ? AND refresh_token = ?",
    [userId, refreshToken]
  );
  return rows;
};

const updateResetToken = async (userId, resetToken, resetTokenExpiry) => {
  const [result] = await pool.execute(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
    [resetToken, resetTokenExpiry, userId]
  );
  return result;
};

const findUserByResetToken = async (token, now) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
    [token, now]
  );
  return rows;
};

const updatePasswordAfterReset = async (userId, hashedPassword) => {
  const [result] = await pool.execute(
    `UPDATE users
     SET password = ?, reset_token = NULL, reset_token_expiry = NULL
     WHERE id = ?`,
    [hashedPassword, userId]
  );
  return result;
};

module.exports = {
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
};