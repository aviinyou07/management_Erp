const Break = require("../models/Break");
const { Attendance } = require("../models/Attendance");
const { Op } = require("sequelize");


exports.breakIn = async (req, res) => {
  try {

    const userId = req.userId;

    const attendance = await Attendance.findOne({
      where: { userId, checkOut: null }
    });

    if (!attendance) {
      return res.status(400).json({
        message: "User is not checked-in"
      });
    }

    // Check if break already active
    const existingBreak = await Break.findOne({
      where: {
        attendanceId: attendance.id,
        breakOut: null
      }
    });

    if (existingBreak) {
      return res.status(400).json({
        message: "Break already started. Please break-out first."
      });
    }

    const breakData = await Break.create({
      userId,
      attendanceId: attendance.id,
      breakIn: new Date()
    });

    res.status(201).json({
      message: "Break started successfully",
      data: breakData
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.breakOut = async (req, res) => {
  try {

    const userId = req.userId;

    // start of today
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    // 1️⃣ Check today's attendance
    const attendance = await Attendance.findOne({
      where: {
        userId,
        checkOut: null,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    if (!attendance) {
      return res.status(400).json({
        message: "No active attendance found for today"
      });
    }

    // 2️⃣ Find active break
    const activeBreak = await Break.findOne({
      where: {
        userId,
        attendanceId: attendance.id,
        breakOut: null
      }
    });

    if (!activeBreak) {
      return res.status(400).json({
        message: "No active break found"
      });
    }

    const breakOutTime = new Date();

    // 3️⃣ Calculate duration
    const diff = breakOutTime - activeBreak.breakIn;

    const minutes = Math.floor(diff / (1000 * 60));

    // 4️⃣ Add break time to attendance
    attendance.breakDuration =
      (attendance.breakDuration || 0) + minutes;

    await attendance.save();

    // 5️⃣ Delete break row
    await activeBreak.destroy();

    res.json({
      message: "Break ended successfully",
      breakMinutes: minutes,
      totalBreakMinutes: attendance.breakDuration
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};