const {
  getCertificationsByUserId,
  addCertification,
  deleteCertificationById
} = require("../repositories/certificationRepository");

const getCertifications = async (req, res) => {
  try {
    const rows = await getCertificationsByUserId(req.user.id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get certifications error:", error);
    return res.status(500).json({
      message: "Error fetching certifications",
      error: error.message
    });
  }
};

const createCertification = async (req, res) => {
  try {
    await addCertification(req.user.id, req.body || {});
    return res.status(201).json({
      message: "Certification added successfully"
    });
  } catch (error) {
    console.error("Create certification error:", error);
    return res.status(500).json({
      message: "Error adding certification",
      error: error.message
    });
  }
};

const removeCertification = async (req, res) => {
  try {
    await deleteCertificationById(req.params.id, req.user.id);
    return res.status(200).json({
      message: "Certification deleted successfully"
    });
  } catch (error) {
    console.error("Delete certification error:", error);
    return res.status(500).json({
      message: "Error deleting certification",
      error: error.message
    });
  }
};

module.exports = {
  getCertifications,
  createCertification,
  removeCertification
};