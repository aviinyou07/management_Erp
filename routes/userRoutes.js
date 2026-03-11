const router = require("express").Router();
const controller = require("../controllers/userController");

router.get("/profile/:id", controller.getProfile);
router.post("/follow/:id", controller.followUser);
router.post("/unfollow/:id", controller.unfollowUser);

module.exports = router;