const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const { getMe, updateMe } = require("../controllers/userController");

const router = express.Router();

router.get("/me", verifyAccessToken, getMe);
router.put("/me", verifyAccessToken, updateMe);

module.exports = router;