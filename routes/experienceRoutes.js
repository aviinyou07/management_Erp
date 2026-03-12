const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getExperiences,
  createExperience,
  removeExperience
} = require("../controllers/experienceController");

const router = express.Router();

router.get("/", verifyAccessToken, getExperiences);
router.post("/", verifyAccessToken, createExperience);
router.delete("/:id", verifyAccessToken, removeExperience);

module.exports = router;