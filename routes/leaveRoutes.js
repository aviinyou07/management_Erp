const express = require("express");

const router = express.Router();
const {authenticate}=require("../middleware/authentication");

const controller = require("../controllers/leaveController");

router.post("/apply",authenticate, controller.applyLeave);

router.get("/", authenticate,controller.getLeaves);
router.put("/", authenticate,controller.updateLeaveStatus);

module.exports = router;