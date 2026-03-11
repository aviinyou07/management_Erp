const likeService = require("../services/likeService");

/* ---------------- POST LIKE ---------------- */

exports.likePost = async (req, res, next) => {
  try {

    const userId = req.body.userId;
    const postId = req.params.postId;

    await likeService.likePost(userId, postId);

    res.json({
      success: true,
      message: "Post liked"
    });

  } catch (err) {
    next(err);
  }
};


exports.unlikePost = async (req, res, next) => {
  try {

    const userId = req.body.userId;
    const postId = req.params.postId;

    await likeService.unlikePost(userId, postId);

    res.json({
      success: true,
      message: "Post unliked"
    });

  } catch (err) {
    next(err);
  }
};



/* ---------------- COMMENT LIKE ---------------- */

exports.likeComment = async (req, res, next) => {
  try {

    const userId = req.body.userId;
    const commentId = req.params.commentId;

    await likeService.likeComment(userId, commentId);

    res.json({
      success: true,
      message: "Comment liked"
    });

  } catch (err) {
    next(err);
  }
};



exports.unlikeComment = async (req, res, next) => {
  try {

    const userId = req.body.userId;
    const commentId = req.params.commentId;

    await likeService.unlikeComment(userId, commentId);

    res.json({
      success: true,
      message: "Comment unliked"
    });

  } catch (err) {
    next(err);
  }
};