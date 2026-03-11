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

    const userId = req.body.userId;
    const targetId = req.params.id;

    const result = await userService.followUser(userId, targetId);

    res.json(result);

  } catch (err) {
    next(err);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {

    const userId = req.body.userId;
    const targetId = req.params.id;

    const result = await userService.unfollowUser(userId, targetId);

    res.json(result);

  } catch (err) {
    next(err);
  }
};
