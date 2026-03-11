const userModel = require("../models/userModel");
const followModel = require("../models/followModel");

exports.getProfile = async (id) => {
  return await userModel.getUserById(id);
};

exports.followUser = async (userId, targetId) => {

  if (userId == targetId) {
    throw new Error("User cannot follow themselves");
  }

  const isFollowing = await followModel.isFollowing(userId, targetId);

  // already following
  if (isFollowing) {
    return { message: "Already followed" };
  }

  await followModel.followUser(userId, targetId);

  // increase followers count
  await userModel.incrementFollowers(targetId);

  return { message: "Followed successfully" };
};

exports.unfollowUser = async (userId, targetId) => {

  const isFollowing = await followModel.isFollowing(userId, targetId);

  if (!isFollowing) {
    return { message: "User not followed yet" };
  }

  await followModel.unfollowUser(userId, targetId);
  await userModel.decrementFollowers(targetId);

  return { message: "Unfollowed successfully" };
};