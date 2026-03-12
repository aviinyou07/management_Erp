const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const {
  getContactInfo,
  updateContactInfo
} = require("../controllers/contactController");

const router = express.Router();

router.get("/", verifyAccessToken, getContactInfo);
router.put("/", verifyAccessToken, updateContactInfo);

module.exports = router;