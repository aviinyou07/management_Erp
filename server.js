const express = require("express");
const {authenticateDB}=require("./models/index");
require("dotenv").config();
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());
require("./cron/autoCheckout");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const breakRoutes = require("./routes/breakRoutes");
const teamRoutes = require("./routes/team");
const adminRoutes = require("./routes/admin");


app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/break", breakRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/admin", adminRoutes);       

app.listen(process.env.PORT || 5000, async() => {
  console.log("Server running on port " + (process.env.PORT || 5000));

    await authenticateDB();


});