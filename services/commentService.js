const db = require("../config/db");

// Add Comment
exports.addComment = async (postId, userId, content) => {
  try {

    // Insert comment
    const insertQuery = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `;

    await db.query(insertQuery, [postId, userId, content]);

    // Update comment count
    const updateQuery = `
      UPDATE posts 
      SET comments_count = comments_count + 1
      WHERE id = ?
    `;

    await db.query(updateQuery, [postId]);

    return { success: true, message: "Comment added successfully" };

  } catch (error) {
    throw error;
  }
};


// Reply Comment
exports.replyComment = async (commentId, userId, content) => {

  // Get parent comment
  const [parent] = await db.query(
    `SELECT post_id FROM comments WHERE id = ?`,
    [commentId]
  );

  if (parent.length === 0) {
    throw new Error("Comment not found");
  }

  const postId = parent[0].post_id;

  // Insert reply
  const insertQuery = `
    INSERT INTO comments (post_id, user_id, content, parent_comment_id)
    VALUES (?, ?, ?, ?)
  `;

  await db.query(insertQuery, [postId, userId, content, commentId]);

  // Update post comment count
  await db.query(
    `UPDATE posts 
     SET comments_count = comments_count + 1 
     WHERE id = ?`,
    [postId]
  );

  return { success: true, message: "Reply added successfully" };
};


// Get Comments of Post
exports.getPostComments = async (postId) => {

  const [rows] = await db.query(
    `SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC`,
    [postId]
  );

  return rows;
};