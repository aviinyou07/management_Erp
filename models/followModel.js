const db = require("../config/db");

exports.followUser = async (userId, targetId) => {
  await db.query(
    "INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?,?)",
    [userId, targetId]
  );
};

exports.unfollowUser = async (userId, targetId) => {
  await db.query(
    "DELETE FROM follows WHERE follower_id=? AND following_id=?",
    [userId, targetId]
  );
};