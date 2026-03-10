const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME || "attendance_db", process.env.DATABASE_USER || "root",
   process.env.DATABASE_PASSWORD || "dbms@1234", {
  host: process.env.DATABASE_HOST || "localhost",
  dialect: process.env.DATABASE_DIALECT || "mysql"  ,
  logging: false,
  timezone: "+05:30",   // India Timezone
});

module.exports = sequelize;