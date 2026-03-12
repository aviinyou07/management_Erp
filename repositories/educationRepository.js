const pool = require("../config/db");

const getEducationsByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      institution,
      degree,
      start_year,
      end_year,
      grade,
      focus_area,
      created_at,
      updated_at
    FROM user_educations
    WHERE user_id = ?
    ORDER BY start_year DESC, id DESC`,
    [userId]
  );
  return rows;
};

const addEducation = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_educations
     (user_id, institution, degree, start_year, end_year, grade, focus_area)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.institution || null,
      data.degree || null,
      data.start_year || null,
      data.end_year || null,
      data.grade || null,
      data.focus_area || null
    ]
  );
  return result;
};

const deleteEducationById = async (id, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_educations WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result;
};

module.exports = {
  getEducationsByUserId,
  addEducation,
  deleteEducationById
};