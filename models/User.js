const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

 const  User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  team: DataTypes.STRING
});
module.exports = {User};
