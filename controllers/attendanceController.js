const { Attendance } = require("../models/Attendance");
const Break = require("../models/Break");

const Team = require("../models/Team");
const TeamMember = require("../models/TeamMember");

function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371000; // Earth radius in meters

  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.checkIn = async (req, res) => {
  try {

    const userId = req.userId;
    
    const { workMode, latitude, longitude } = req.body;
    const OFFICE_LAT = 26.9124;
    const OFFICE_LON = 75.7873;
    const MAX_DISTANCE = 30;

    if (!workMode) {
      return res.status(400).json({
        message: "Work mode is required"
      });
    }

    

    // 🌍 Office location validation
    if (workMode === "office") {

      if (!latitude || !longitude) {
        return res.status(400).json({
          message: "Location required for office check-in"
        });
      }

      const distance = getDistance(
        latitude,
        longitude,
        OFFICE_LAT,
        OFFICE_LON
      );

      if (distance > MAX_DISTANCE) {
        return res.status(403).json({
          message: "You are outside office range (30m required)"
        });
      }
    }

    // 1️⃣ Check team exists
    let team = null;
    if(req.body.teamId){
       team = await Team.findByPk(req.teamId);

      if (!team) {
      return res.status(404).json({
        message: "Team not found"
      });
    }
     const member = await TeamMember.findOne({
      where: { teamId: req.body.teamId, userId }
    });

    if (!member) {
      return res.status(403).json({
        message: "User is not a member of this team"
      });
    }
    }

    // 2️⃣ Check user team member
   

    // 3️⃣ Check already checked-in
    const existing = await Attendance.findOne({
      where: {
        userId,
        status: "incomplete"
      }
    });

    if (existing) {
      return res.status(409).json({
        message: "User already checked in"
      });
    }

    // 4️⃣ Create attendance
    const attendance = await Attendance.create({
      userId,
      workMode,
      checkIn: new Date(),
      status: "incomplete"
    });

    res.status(201).json({
      message: "Check-in successful",
      attendance,
      team
    });

  } catch (error) {

    console.error("Checkin error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

exports.checkOut = async (req, res) => {
  try {

    const userId = req.userId;

    const attendance = await Attendance.findOne({
      where: {
        userId,
        status: "incomplete"
      }
    });

    if (!attendance) {
      return res.status(404).json({
        message: "No active check-in found"
      });
    }

    const checkOutTime = new Date();

    // 1️⃣ check active break
    const activeBreak = await Break.findOne({
      where: {
        userId,
        attendanceId: attendance.id,
        breakOut: null
      }
    });

    if (activeBreak) {

      const diffBreak = checkOutTime - activeBreak.breakIn;

      const breakMinutes = Math.floor(diffBreak / (1000 * 60));

      attendance.breakDuration =
        (attendance.breakDuration || 0) + breakMinutes;

      // delete break
      await activeBreak.destroy();
    }

    // 2️⃣ total working time
    const diff = checkOutTime - attendance.checkIn;

    let totalMinutes = Math.floor(diff / (1000 * 60));

    totalMinutes = totalMinutes - (attendance.breakDuration || 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    attendance.checkOut = checkOutTime;
    attendance.totalHours = `${hours}h ${minutes}m`;
    attendance.status = "complete";

    await attendance.save();

    res.json({
      message: "Checkout successful",
      data: attendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.history = async (req, res) => {
  try {

    const userId = req.userId;

    const data = await Attendance.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });

  }
};