const pool = require("../config/db");

const getUserById = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      full_name,
      email,
      mobile,
      user_type,
      country,
      gender,
      dob,
      profile_picture,
      headline,
      current_city,
      state,
      nationality,
      cover_image,
      about,
      last_active_at,
      interests,
      created_at,
      updated_at
    FROM users
    WHERE id = ?`,
    [userId]
  );
  return rows;
};

const updateUserById = async (userId, data) => {
  const {
    full_name,
    country,
    gender,
    dob,
    user_type,
    profile_picture,
    headline,
    current_city,
    state,
    nationality,
    cover_image,
    about,
    interests
  } = data;

  const [result] = await pool.execute(
    `UPDATE users
     SET
       full_name = ?,
       country = ?,
       gender = ?,
       dob = ?,
       user_type = ?,
       profile_picture = ?,
       headline = ?,
       current_city = ?,
       state = ?,
       nationality = ?,
       cover_image = ?,
       about = ?,
       interests = CAST(? AS JSON),
       last_active_at = NOW()
     WHERE id = ?`,
    [
      full_name || null,
      country || null,
      gender || null,
      dob || null,
      user_type || null,
      profile_picture || null,
      headline || null,
      current_city || null,
      state || null,
      nationality || null,
      cover_image || null,
      about || null,
      JSON.stringify(Array.isArray(interests) ? interests : []),
      userId
    ]
  );

  return result;
};

module.exports = {
  getUserById,
  updateUserById
};