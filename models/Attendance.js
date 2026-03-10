const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attendance = sequelize.define("Attendance", {
  userId: DataTypes.INTEGER,
  workMode: DataTypes.STRING,
  checkIn: DataTypes.DATE,
  checkOut: DataTypes.DATE,
  totalHours: DataTypes.STRING,
  breakDuration: {
  type: DataTypes.INTEGER,
  
  defaultValue: 0   // store in minutes
},
teamId:DataTypes.UUID,
  status: DataTypes.STRING
});

module.exports = {Attendance};