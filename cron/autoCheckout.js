const cron = require("node-cron");
const { Attendance } = require("../models/Attendance");
const Break = require("../models/Break");

cron.schedule("0 18 * * *", async () => {
  console.log("Running auto checkout at 6 PM");

  const attendances = await Attendance.findAll({
    where: {
      checkOut: null,
      status: "incomplete"
    }
  });

  for (const attendance of attendances) {

    const checkOutTime = new Date();

    // check active break
    const activeBreak = await Break.findOne({
      where: {
        attendanceId: attendance.id,
        breakOut: null
      }
    });

    if (activeBreak) {

      const diffBreak = checkOutTime - activeBreak.breakIn;

      const breakMinutes = Math.floor(diffBreak / (1000 * 60));

      attendance.breakDuration =
        (attendance.breakDuration || 0) + breakMinutes;

      await activeBreak.destroy();
    }

    const diff = checkOutTime - attendance.checkIn;

    let totalMinutes = Math.floor(diff / (1000 * 60));

    totalMinutes = totalMinutes - (attendance.breakDuration || 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    attendance.checkOut = checkOutTime;
    attendance.totalHours = `${hours}h ${minutes}m`;
    attendance.status = "complete";

    await attendance.save();
  }

},{
  timezone: "Asia/Kolkata"
});