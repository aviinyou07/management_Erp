const {
  getExperiencesByUserId,
  addExperience,
  deleteExperienceById
} = require("../repositories/experienceRepository");

const getExperiences = async (req, res) => {
  try {
    const rows = await getExperiencesByUserId(req.user.id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get experiences error:", error);
    return res.status(500).json({
      message: "Error fetching experiences",
      error: error.message
    });
  }
};

const createExperience = async (req, res) => {
  try {
    await addExperience(req.user.id, req.body || {});
    return res.status(201).json({
      message: "Experience added successfully"
    });
  } catch (error) {
    console.error("Create experience error:", error);
    return res.status(500).json({
      message: "Error adding experience",
      error: error.message
    });
  }
};

const removeExperience = async (req, res) => {
  try {
    await deleteExperienceById(req.params.id, req.user.id);
    return res.status(200).json({
      message: "Experience deleted successfully"
    });
  } catch (error) {
    console.error("Delete experience error:", error);
    return res.status(500).json({
      message: "Error deleting experience",
      error: error.message
    });
  }
};

module.exports = {
  getExperiences,
  createExperience,
  removeExperience
};