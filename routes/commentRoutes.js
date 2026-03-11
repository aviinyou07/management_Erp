const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");


// Add Comment
router.post(
  "/posts/:postId/comment",
  commentController.addComment
);


// Reply Comment
router.post(
  "/:commentId/reply",
  commentController.replyComment
);


// Get Post Comments
router.get(
  "/posts/:postId/comments",
  commentController.getComments
);

module.exports = router;