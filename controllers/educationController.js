const {
  getEducationsByUserId,
  addEducation,
  deleteEducationById
} = require("../repositories/educationRepository");

const getEducations = async (req, res) => {
  try {
    const rows = await getEducationsByUserId(req.user.id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get educations error:", error);
    return res.status(500).json({
      message: "Error fetching educations",
      error: error.message
    });
  }
};

const createEducation = async (req, res) => {
  try {
    await addEducation(req.user.id, req.body || {});
    return res.status(201).json({
      message: "Education added successfully"
    });
  } catch (error) {
    console.error("Create education error:", error);
    return res.status(500).json({
      message: "Error adding education",
      error: error.message
    });
  }
};

const removeEducation = async (req, res) => {
  try {
    await deleteEducationById(req.params.id, req.user.id);
    return res.status(200).json({
      message: "Education deleted successfully"
    });
  } catch (error) {
    console.error("Delete education error:", error);
    return res.status(500).json({
      message: "Error deleting education",
      error: error.message
    });
  }
};

module.exports = {
  getEducations,
  createEducation,
  removeEducation
};