const router = require("express").Router();
const controller = require("../controllers/postController");

// Create Post
router.post("/create", controller.createPost);

// Feed APIs
router.get("/feed/country", controller.countryFeed);
router.get("/feed/worldwide", controller.worldFeed);
router.get("/feed/following", controller.followingFeed);

// Like / Unlike (toggle)
router.post("/:postId/like", controller.likePost);
router.delete("/:postId/unlike", controller.unlikePost);

// Get Single Post
router.get("/:postId", controller.getPost);

module.exports = router;