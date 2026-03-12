require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
  } else {
    console.log("MySQL Connected");

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  }
});