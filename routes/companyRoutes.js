const express = require("express");
const router = express.Router();
const companyController = require("../controller/companyController");
router.get("/", companyController.getCompanies);
router.get("/:id", companyController.getCompanyById);
router.get("/:id/jobs", companyController.getCompanyJobs);

module.exports = router;