const express = require("express");
const { authenticate } = require("../middleware/authentication");

const router = express.Router();

const controller = require("../controllers/attendanceController");

router.post("/checkin", authenticate,controller.checkIn);

router.post("/checkout",authenticate, controller.checkOut);

router.get("/history",authenticate, controller.history);

module.exports = router;