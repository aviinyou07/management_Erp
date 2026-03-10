const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Leave = sequelize.define("Leave", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fromDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  toDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  }
}, {
  timestamps: true
});

module.exports = {Leave};