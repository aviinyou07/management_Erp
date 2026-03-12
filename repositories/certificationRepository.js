const pool = require("../config/db");

const getCertificationsByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      name,
      issuer,
      issue_year,
      description,
      created_at,
      updated_at
    FROM user_certifications
    WHERE user_id = ?
    ORDER BY issue_year DESC, id DESC`,
    [userId]
  );
  return rows;
};

const addCertification = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_certifications
     (user_id, name, issuer, issue_year, description)
     VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      data.name || null,
      data.issuer || null,
      data.issue_year || null,
      data.description || null
    ]
  );
  return result;
};

const deleteCertificationById = async (id, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_certifications WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result;
};

module.exports = {
  getCertificationsByUserId,
  addCertification,
  deleteCertificationById
};