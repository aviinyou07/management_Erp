const {
  getInterestsByUserId,
  addInterest,
  deleteInterestById
} = require("../repositories/interestRepository");

const getInterests = async (req, res) => {
  try {
    const rows = await getInterestsByUserId(req.user.id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get interests error:", error);
    return res.status(500).json({
      message: "Error fetching interests",
      error: error.message
    });
  }
};

const createInterest = async (req, res) => {
  try {
    await addInterest(req.user.id, req.body || {});
    return res.status(201).json({
      message: "Interest added successfully"
    });
  } catch (error) {
    console.error("Create interest error:", error);
    return res.status(500).json({
      message: "Error adding interest",
      error: error.message
    });
  }
};

const removeInterest = async (req, res) => {
  try {
    await deleteInterestById(req.params.id, req.user.id);
    return res.status(200).json({
      message: "Interest deleted successfully"
    });
  } catch (error) {
    console.error("Delete interest error:", error);
    return res.status(500).json({
      message: "Error deleting interest",
      error: error.message
    });
  }
};

module.exports = {
  getInterests,
  createInterest,
  removeInterest
};