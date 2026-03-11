const shareService = require("../services/shareService");

exports.sharePost = async (req, res, next) => {
  try {
    await shareService.sharePost(req.params.postId);
    res.json({ message: "Post shared" });
  } catch (err) {
    next(err);
  }
};