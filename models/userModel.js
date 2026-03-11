const db = require("../config/db");

exports.getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id,name,country,badge,followers_count FROM users WHERE id=?",
    [id]
  );
  return rows[0];
};

exports.incrementFollowers = async (id) => {
  await db.query(
    "UPDATE users SET followers_count = followers_count + 1 WHERE id=?",
    [id]
  );
};

exports.decrementFollowers = async (id) => {
  await db.query(
    "UPDATE users SET followers_count = followers_count - 1 WHERE id=?",
    [id]
  );
};