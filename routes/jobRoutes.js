const express = require("express");
const router = express.Router();

const jobsController = require("../controller/jobController");
router.get("/cards", jobsController.getJobs);
router.get("/:id", jobsController.getJobById);


module.exports = router;