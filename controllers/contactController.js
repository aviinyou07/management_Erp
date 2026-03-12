const {
  getContactInfoByUserId,
  upsertContactInfoByUserId
} = require("../repositories/contactRepository");

const getContactInfo = async (req, res) => {
  try {
    const rows = await getContactInfoByUserId(req.user.id);
    return res.status(200).json(rows.length ? rows[0] : {});
  } catch (error) {
    console.error("Get contact info error:", error);
    return res.status(500).json({
      message: "Error fetching contact information",
      error: error.message
    });
  }
};

const updateContactInfo = async (req, res) => {
  try {
    await upsertContactInfoByUserId(req.user.id, req.body || {});
    return res.status(200).json({
      message: "Contact information updated successfully"
    });
  } catch (error) {
    console.error("Update contact info error:", error);
    return res.status(500).json({
      message: "Error updating contact information",
      error: error.message
    });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo
};