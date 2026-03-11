const commentService = require("../services/commentService");

// Add Comment
exports.addComment = async (req, res) => {

  try {

    const { userId, content } = req.body;
    const postId = req.params.postId;

    const result = await commentService.addComment(
      postId,
      userId,
      content
    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// Reply Comment
exports.replyComment = async (req, res) => {

  try {

    const { userId, content } = req.body;
    const commentId = req.params.commentId;

    const result = await commentService.replyComment(
      commentId,
      userId,
      content
    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// Get Comments
exports.getComments = async (req, res) => {

  try {

    const postId = req.params.postId;

    const comments = await commentService.getPostComments(postId);

    res.json({
      success: true,
      data: comments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};