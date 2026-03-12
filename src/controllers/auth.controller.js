const { registerUser, loginUser, getProfile } = require("../services/auth.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;
    const result = await registerUser({ name, email, password, role, department });
    sendSuccess(res, result, "Registration successful.", 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    sendSuccess(res, result, "Login successful.");
  } catch (err) {
    next(err);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await getProfile(req.user.id);
    sendSuccess(res, { user }, "Profile fetched.");
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, profile };
