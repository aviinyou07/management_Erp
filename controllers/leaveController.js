const { Leave } = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  try {

    const userId = req.userId;
    
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: "fromDate, toDate and reason are required"
      });
    }

    // 1️⃣ Check if pending leave already exists
    const pendingLeave = await Leave.findOne({
      where: {
        userId,
        status: "pending"
      }
    });

    if (pendingLeave) {
      return res.status(409).json({
        message: "You already have a pending leave request"
      });
    }

    // 2️⃣ Create leave
    const leave = await Leave.create({
      userId,
      fromDate,
      toDate,
      reason
    });

    res.status(201).json({
      message: "Leave applied successfully",
      data: leave
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

exports.getLeaves = async (req, res) => {
  try {

    const userId = req.userId;

    const leaves = await Leave.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    res.json({
      count: leaves.length,
      data: leaves
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {

    const userRole = req.role; 
    
      // middleware se aayega
    const { id, status } = req.body;

    // 1️⃣ Only admin allowed
    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Only admin can update leave status"
      });
    }

    // 2️⃣ Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'approved' or 'rejected'"
      });
    }

    // 3️⃣ Find leave
    const leave = await Leave.findByPk(id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    // 4️⃣ Update status
    leave.status = status;

    await leave.save();

    res.json({
      message: "Leave status updated",
      data: leave
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};