const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getAnalytics,
  updateAnalytics
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", verifyAccessToken, getAnalytics);
router.put("/", verifyAccessToken, updateAnalytics);

module.exports = router;