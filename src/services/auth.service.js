const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { generateToken } = require("../utils/jwt.utils");

/**
 * Register a new user and seed their leave balance.
 */
const registerUser = async ({ name, email, password, role = "employee", department }) => {
  // Check duplicate email
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    const err = new Error("Email already registered.");
    err.statusCode = 409;
    throw err;
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashed = await bcrypt.hash(password, rounds);

  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashed, role, department || null]
  );

  const userId = result.insertId;

  // Seed default leave balance for new user
  await db.query(
    `INSERT INTO leave_balance (user_id, annual_total, annual_used, sick_total, sick_used, casual_total, casual_used, lwop_used)
     VALUES (?, 18, 0, 8, 0, 4, 0, 0)`,
    [userId]
  );

  const token = generateToken({ id: userId, email, role, name });
  return { token, user: { id: userId, name, email, role, department } };
};

/**
 * Authenticate user credentials and return JWT.
 */
const loginUser = async ({ email, password }) => {
  const [rows] = await db.query(
    "SELECT id, name, email, password, role, department FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  const { password: _pw, ...safeUser } = user;
  return { token, user: safeUser };
};

/**
 * Fetch current user profile.
 */
const getProfile = async (userId) => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, department, created_at FROM users WHERE id = ?",
    [userId]
  );
  if (rows.length === 0) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  return rows[0];
};

module.exports = { registerUser, loginUser, getProfile };
