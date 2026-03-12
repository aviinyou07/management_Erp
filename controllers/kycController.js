const {
  getKycDocumentsByUserId,
  addKycDocument,
  updateKycDocumentById,
  deleteKycDocumentById
} = require("../repositories/kycRepository");

const getKycDocuments = async (req, res) => {
  try {
    const rows = await getKycDocumentsByUserId(req.user.id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get KYC error:", error);
    return res.status(500).json({
      message: "Error fetching KYC documents",
      error: error.message
    });
  }
};

const createKycDocument = async (req, res) => {
  try {
    await addKycDocument(req.user.id, req.body || {});
    return res.status(201).json({
      message: "KYC document added successfully"
    });
  } catch (error) {
    console.error("Create KYC error:", error);
    return res.status(500).json({
      message: "Error adding KYC document",
      error: error.message
    });
  }
};

const updateKycDocument = async (req, res) => {
  try {
    await updateKycDocumentById(req.params.id, req.user.id, req.body || {});
    return res.status(200).json({
      message: "KYC document updated successfully"
    });
  } catch (error) {
    console.error("Update KYC error:", error);
    return res.status(500).json({
      message: "Error updating KYC document",
      error: error.message
    });
  }
};

const removeKycDocument = async (req, res) => {
  try {
    await deleteKycDocumentById(req.params.id, req.user.id);
    return res.status(200).json({
      message: "KYC document deleted successfully"
    });
  } catch (error) {
    console.error("Delete KYC error:", error);
    return res.status(500).json({
      message: "Error deleting KYC document",
      error: error.message
    });
  }
};

module.exports = {
  getKycDocuments,
  createKycDocument,
  updateKycDocument,
  removeKycDocument
};