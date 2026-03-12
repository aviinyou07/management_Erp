const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getCertifications,
  createCertification,
  removeCertification
} = require("../controllers/certificationController");

const router = express.Router();

router.get("/", verifyAccessToken, getCertifications);
router.post("/", verifyAccessToken, createCertification);
router.delete("/:id", verifyAccessToken, removeCertification);

module.exports = router;