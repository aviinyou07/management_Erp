const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Break = sequelize.define("Break", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attendanceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  breakIn: {
    type: DataTypes.DATE,
    allowNull: false
  },
  breakOut: {
    type: DataTypes.DATE
  },
  duration: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Break;