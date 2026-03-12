const { getUserById, updateUserById } = require("../repositories/userRepository");

const safeJson = (value) => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return [];
};

const getMe = async (req, res) => {
  try {
    const rows = await getUserById(req.user.id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    return res.status(200).json({
      ...user,
      interests: safeJson(user.interests)
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      message: "Error fetching user",
      error: error.message
    });
  }
};

const updateMe = async (req, res) => {
  try {
    await updateUserById(req.user.id, req.body || {});
    return res.status(200).json({
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
};

module.exports = {
  getMe,
  updateMe
};