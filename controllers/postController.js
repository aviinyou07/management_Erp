const postService = require("../services/postService");

exports.createPost = async (req, res, next) => {
  try {
    const id = await postService.createPost(req.body);
    res.json({ postId: id });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const data = await postService.getPost(req.params.postId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.countryFeed = async (req, res, next) => {
  try {
    const data = await postService.countryFeed(
      req.query.userId,
      req.query.page,
      req.query.limit
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.worldFeed = async (req, res, next) => {
  try {
    const data = await postService.worldFeed(
      req.query.page,
      req.query.limit
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.followingFeed = async (req, res, next) => {
  try {
    const data = await postService.followingFeed(
      req.query.userId,
      req.query.page,
      req.query.limit
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};






exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;

    const result = await postService.likePost(postId, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;

    const result = await postService.unlikePost(postId, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};