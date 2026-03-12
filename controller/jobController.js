const jobsService = require("../service/jobService");
async function getJobs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const jobs = await jobsService.getJobCards(page, limit);

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

async function getJobById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id"
      });
    }

    const job = await jobsService.getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}


module.exports = { getJobs,getJobById };
