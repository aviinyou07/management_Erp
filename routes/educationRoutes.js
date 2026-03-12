const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getEducations,
  createEducation,
  removeEducation
} = require("../controllers/educationController");

const router = express.Router();

router.get("/", verifyAccessToken, getEducations);
router.post("/", verifyAccessToken, createEducation);
router.delete("/:id", verifyAccessToken, removeEducation);

module.exports = router;