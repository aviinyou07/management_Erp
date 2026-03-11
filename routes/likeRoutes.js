const router = require("express").Router();
const controller = require("../controllers/likeController");

// Post Like
router.post("/:postId/like", controller.likePost);
router.post("/:postId/unlike", controller.unlikePost);

// Comment / Reply Like
router.post("/comments/:commentId/like", controller.likeComment);
router.delete("/comments/:commentId/unlike", controller.unlikeComment);

module.exports = router;