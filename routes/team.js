const express = require("express");
const router = express.Router();

const teamController = require("../controllers/team");
const { authenticate } = require("../middleware/authentication");

router.post("/create",authenticate,teamController.createTeam);

router.post("/add-member",authenticate,teamController.addMember);

module.exports = router;