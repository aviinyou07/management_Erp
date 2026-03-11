const router = require("express").Router();
const controller = require("../controllers/shareController");

router.post("/:postId/share", controller.sharePost);

module.exports = router;