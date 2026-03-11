const userModel = require("../models/userModel");
const followModel = require("../models/followModel");

exports.getProfile = async (id) => {
  return await userModel.getUserById(id);
};

exports.followUser = async (userId, targetId) => {
  await followModel.followUser(userId, targetId);
  await userModel.incrementFollowers(targetId);
};

exports.unfollowUser = async (userId, targetId) => {
  await followModel.unfollowUser(userId, targetId);
  await userModel.decrementFollowers(targetId);
};