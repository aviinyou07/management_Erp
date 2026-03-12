const pool = require("../config/db");

const getExperiencesByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      title,
      company,
      start_month,
      start_year,
      end_month,
      end_year,
      is_current,
      description,
      created_at,
      updated_at
    FROM user_experiences
    WHERE user_id = ?
    ORDER BY start_year DESC, id DESC`,
    [userId]
  );
  return rows;
};

const addExperience = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_experiences
     (user_id, title, company, start_month, start_year, end_month, end_year, is_current, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.title || null,
      data.company || null,
      data.start_month || null,
      data.start_year || null,
      data.end_month || null,
      data.end_year || null,
      data.is_current || false,
      data.description || null
    ]
  );
  return result;
};

const deleteExperienceById = async (id, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_experiences WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result;
};

module.exports = {
  getExperiencesByUserId,
  addExperience,
  deleteExperienceById
};