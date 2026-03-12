const db = require("../config/db");

/**
 * Get all holidays, optionally filtered by year.
 */
const getAllHolidays = async (year = null) => {
  let sql = "SELECT id, name, date, type FROM holidays";
  const params = [];

  if (year) {
    sql += " WHERE YEAR(date) = ?";
    params.push(year);
  }

  sql += " ORDER BY date ASC";
  const [rows] = await db.query(sql, params);
  return rows;
};

/**
 * Admin: add a holiday.
 */
const addHoliday = async ({ name, date, type }) => {
  const [result] = await db.query(
    "INSERT INTO holidays (name, date, type) VALUES (?, ?, ?)",
    [name, date, type || "National Holiday"]
  );
  return { id: result.insertId, name, date, type };
};

/**
 * Admin: delete a holiday.
 */
const deleteHoliday = async (holidayId) => {
  const [result] = await db.query("DELETE FROM holidays WHERE id = ?", [holidayId]);
  if (result.affectedRows === 0) {
    const err = new Error("Holiday not found.");
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true };
};

module.exports = { getAllHolidays, addHoliday, deleteHoliday };
