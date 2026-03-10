const express = require("express");
const router = express.Router();

const breakController = require("../controllers/breakController");
const { authenticate } = require("../middleware/authentication");

router.post("/break-in", authenticate, breakController.breakIn);

router.post("/break-out", authenticate, breakController.breakOut);

module.exports = router;