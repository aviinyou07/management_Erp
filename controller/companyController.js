const companyService = require("../service/companyService");

async function getCompanies(req, res) {
  try {
    const companies = await companyService.getCompanies();

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

async function getCompanyById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid company id"
      });
    }

    const company = await companyService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

async function getCompanyJobs(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid company id"
      });
    }

    const jobs = await companyService.getCompanyJobs(id);

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

module.exports = {
  getCompanies,
  getCompanyById,
  getCompanyJobs
};