const db = require("../config/db");

exports.sharePost = async (postId) => {
  await db.query(
    "UPDATE posts SET shares_count = shares_count + 1 WHERE id=?",
    [postId]
  );
};