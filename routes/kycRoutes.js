const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getKycDocuments,
  createKycDocument,
  updateKycDocument,
  removeKycDocument
} = require("../controllers/kycController");

const router = express.Router();

router.get("/", verifyAccessToken, getKycDocuments);
router.post("/", verifyAccessToken, createKycDocument);
router.put("/:id", verifyAccessToken, updateKycDocument);
router.delete("/:id", verifyAccessToken, removeKycDocument);

module.exports = router;