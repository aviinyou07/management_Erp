const db = require("../config/db");

exports.addComment = async (postId, userId, content) => {
  await db.query(
    "INSERT INTO comments (post_id,user_id,content,parent_comment_id) VALUES (?,?,?,NULL)",
    [postId, userId, content]
  );
};

exports.replyComment = async (commentId, userId, content) => {
  await db.query(
    `
INSERT INTO comments (post_id,user_id,content,parent_comment_id)
SELECT post_id,?,?,id FROM comments WHERE id=?
`,
    [userId, content, commentId]
  );
};

exports.getComments = async (postId) => {
  const [rows] = await db.query(
    "SELECT * FROM comments WHERE post_id=? ORDER BY created_at ASC",
    [postId]
  );
  return rows;
};