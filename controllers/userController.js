const userService = require("../services/userService");

exports.getProfile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    await userService.followUser(req.body.userId, req.params.id);
    res.json({ message: "Followed successfully" });
  } catch (err) {
    next(err);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    await userService.unfollowUser(req.body.userId, req.params.id);
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    next(err);
  }
};