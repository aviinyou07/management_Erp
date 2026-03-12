const pool = require("../config/db");

const getContactInfoByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      phone,
      email,
      address_line,
      city,
      state,
      postal_code,
      country,
      working_hours,
      updated_at
    FROM user_contact_info
    WHERE user_id = ?`,
    [userId]
  );
  return rows;
};

const upsertContactInfoByUserId = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_contact_info
     (user_id, phone, email, address_line, city, state, postal_code, country, working_hours)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       phone = VALUES(phone),
       email = VALUES(email),
       address_line = VALUES(address_line),
       city = VALUES(city),
       state = VALUES(state),
       postal_code = VALUES(postal_code),
       country = VALUES(country),
       working_hours = VALUES(working_hours)`,
    [
      userId,
      data.phone || null,
      data.email || null,
      data.address_line || null,
      data.city || null,
      data.state || null,
      data.postal_code || null,
      data.country || null,
      data.working_hours || null
    ]
  );
  return result;
};

module.exports = {
  getContactInfoByUserId,
  upsertContactInfoByUserId
};