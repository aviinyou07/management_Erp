const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getInterests,
  createInterest,
  removeInterest
} = require("../controllers/interestController");

const router = express.Router();

router.get("/", verifyAccessToken, getInterests);
router.post("/", verifyAccessToken, createInterest);
router.delete("/:id", verifyAccessToken, removeInterest);

module.exports = router;