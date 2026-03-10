const sequelize = require("../config/database");

const User = require("./User");
const Attendance = require("./Attendance");
const Task = require("./Task");
const Leave = require("./Leave");
const Team = require("./Team");
const TeamMember = require("./TeamMember");
const authenticateDB = async () => {

  try {
    Team.hasMany(TeamMember, { foreignKey: "teamId" });
    TeamMember.belongsTo(Team, { foreignKey: "teamId" });
       await sequelize.sync({force: false,alter: true});
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    
  }
}

module.exports = {
  authenticateDB
};