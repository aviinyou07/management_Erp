const pool = require("../config/db");

const getKycDocumentsByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      document_type,
      document_number_masked,
      file_name,
      file_url,
      status,
      uploaded_at,
      updated_at
    FROM user_kyc_documents
    WHERE user_id = ?
    ORDER BY uploaded_at DESC, id DESC`,
    [userId]
  );
  return rows;
};

const addKycDocument = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_kyc_documents
     (user_id, document_type, document_number_masked, file_name, file_url, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.document_type,
      data.document_number_masked || null,
      data.file_name || null,
      data.file_url || null,
      data.status || "PENDING"
    ]
  );
  return result;
};

const updateKycDocumentById = async (id, userId, data) => {
  const [result] = await pool.execute(
    `UPDATE user_kyc_documents
     SET
       document_type = ?,
       document_number_masked = ?,
       file_name = ?,
       file_url = ?,
       status = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.document_type,
      data.document_number_masked || null,
      data.file_name || null,
      data.file_url || null,
      data.status || "PENDING",
      id,
      userId
    ]
  );
  return result;
};

const deleteKycDocumentById = async (id, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_kyc_documents WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result;
};

module.exports = {
  getKycDocumentsByUserId,
  addKycDocument,
  updateKycDocumentById,
  deleteKycDocumentById
};