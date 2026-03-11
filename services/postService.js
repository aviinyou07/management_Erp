const postModel = require("../models/postModel");
const db = require("../config/db");
const { getPagination } = require("../utils/pagination");

exports.createPost = async (data) => {
  return await postModel.createPost(
    data.user_id,
    data.content,
    data.tags
  );
};

exports.getPost = async (postId) => {
  return await postModel.getPostById(postId);
};

exports.countryFeed = async (userId, page = 1, limit = 10) => {

  page = parseInt(page)
  limit = parseInt(limit)

  const offset = (page - 1) * limit

  const [rows] = await db.query(
    `
SELECT p.*,u.name user_name,u.country,u.badge,u.followers_count
FROM posts p
JOIN users u ON p.user_id=u.id
WHERE u.country=(SELECT country FROM users WHERE id=?)
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?
`,
    [userId, limit, offset]
  )

  return rows
}
exports.worldFeed = async (page = 1, limit = 10) => {

  page = parseInt(page)
  limit = parseInt(limit)

  const offset = (page - 1) * limit

  const [rows] = await db.query(
    `
SELECT p.*,u.name user_name,u.country,u.badge,u.followers_count
FROM posts p
JOIN users u ON p.user_id=u.id
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?
`,
    [limit, offset]
  )

  return rows
};

exports.followingFeed = async (userId, page = 1, limit = 10) => {

  page = parseInt(page)
  limit = parseInt(limit)

  const offset = (page - 1) * limit

  const [rows] = await db.query(
    `
SELECT p.*,u.name user_name,u.country,u.badge,u.followers_count
FROM posts p
JOIN users u ON p.user_id=u.id
WHERE p.user_id IN (
SELECT following_id FROM follows WHERE follower_id=?
)
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?
`,
    [userId, limit, offset]
  )

  return rows
};



exports.likePost = async (postId, userId) => {

  // Check if already liked
  const [existing] = await db.query(
    `SELECT * FROM likes WHERE user_id=? AND post_id=?`,
    [userId, postId]
  );

  if (existing.length > 0) {
    return { success: false, message: "Already liked this post" };
  }

  // Insert like
  await db.query(
    `INSERT INTO likes (user_id,post_id) VALUES (?,?)`,
    [userId, postId]
  );

  // Update like count
  await db.query(
    `UPDATE posts SET likes_count = likes_count + 1 WHERE id=?`,
    [postId]
  );

  return { success: true, message: "Post liked" };
};
