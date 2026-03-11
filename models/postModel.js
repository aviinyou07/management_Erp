const db = require("../config/db");

exports.createPost = async (user_id, content, tags) => {
  const [result] = await db.query(
    "INSERT INTO posts (user_id,content,tags) VALUES (?,?,?)",
    [user_id, content, JSON.stringify(tags)]
  );

  return result.insertId;
};

exports.getPostById = async (postId) => {
  const [rows] = await db.query(
    `
SELECT p.*,u.name user_name,u.country,u.badge,u.followers_count
FROM posts p
JOIN users u ON p.user_id=u.id
WHERE p.id=?
`,
    [postId]
  );

  return rows[0];
};