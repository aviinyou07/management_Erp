const pool = require("../config/db");

const getInterestsByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT id, interest_name, created_at
     FROM user_interests
     WHERE user_id = ?
     ORDER BY id DESC`,
    [userId]
  );
  return rows;
};

const addInterest = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_interests (user_id, interest_name)
     VALUES (?, ?)`,
    [userId, data.interest_name]
  );
  return result;
};

const deleteInterestById = async (id, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_interests WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result;
};

module.exports = {
  getInterestsByUserId,
  addInterest,
  deleteInterestById
};