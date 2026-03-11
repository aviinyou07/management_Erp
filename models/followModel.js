const db = require("../config/db");

exports.isFollowing = async (userId, targetId) => {
  const [rows] = await db.query(
    "SELECT id FROM follows WHERE follower_id=? AND following_id=?",
    [userId, targetId]
  );

  return rows.length > 0;
};

exports.followUser = async (userId, targetId) => {
  await db.query(
    "INSERT INTO follows (follower_id, following_id) VALUES (?,?)",
    [userId, targetId]
  );
};

exports.unfollowUser = async (userId, targetId) => {
  await db.query(
    "DELETE FROM follows WHERE follower_id=? AND following_id=?",
    [userId, targetId]
  );
};