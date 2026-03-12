const express = require("express");
const cors = require("cors");

const jobsRoutes = require("./routes/jobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobsRoutes);
app.use("/api/companies", companyRoutes);


module.exports = app;