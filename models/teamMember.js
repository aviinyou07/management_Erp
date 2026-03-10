const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TeamMember = sequelize.define("TeamMember", {
  teamId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("leader", "member"),
    defaultValue: "member"
  },
  by:{
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["teamId", "userId"]
    }
  ]
});

module.exports = TeamMember;