const db = require("../config/db");

/* ---------- POST LIKE ---------- */

exports.likePost = async (userId, postId) => {

  await db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
    [userId, postId]
  );

  await db.query(
    "UPDATE posts SET likes_count = likes_count + 1 WHERE id=?",
    [postId]
  );

};


exports.unlikePost = async (userId, postId) => {

  await db.query(
    "DELETE FROM likes WHERE user_id=? AND post_id=?",
    [userId, postId]
  );

  await db.query(
    "UPDATE posts SET likes_count = likes_count - 1 WHERE id=?",
    [postId]
  );

};



/* ---------- COMMENT LIKE ---------- */

exports.likeComment = async (userId, commentId) => {

  await db.query(
    "INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)",
    [userId, commentId]
  );

};


exports.unlikeComment = async (userId, commentId) => {

  await db.query(
    "DELETE FROM comment_likes WHERE user_id=? AND comment_id=?",
    [userId, commentId]
  );

};