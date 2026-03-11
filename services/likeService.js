const likeModel = require("../models/likeModel");

/* ---------------- POST LIKE ---------------- */

exports.likePost = async (userId, postId) => {

  if (!userId || !postId) {
    throw new Error("UserId and PostId required");
  }

  await likeModel.likePost(userId, postId);

};


exports.unlikePost = async (userId, postId) => {

  if (!userId || !postId) {
    throw new Error("UserId and PostId required");
  }

  await likeModel.unlikePost(userId, postId);

};


/* ---------------- COMMENT LIKE ---------------- */

exports.likeComment = async (userId, commentId) => {

  if (!userId || !commentId) {
    throw new Error("UserId and CommentId required");
  }

  await likeModel.likeComment(userId, commentId);

};


exports.unlikeComment = async (userId, commentId) => {

  if (!userId || !commentId) {
    throw new Error("UserId and CommentId required");
  }

  await likeModel.unlikeComment(userId, commentId);

};