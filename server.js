require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const kycRoutes = require("./routes/kycRoutes");
const contactRoutes = require("./routes/contactRoutes");
const interestRoutes = require("./routes/interestRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/educations", educationRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/contact-info", contactRoutes);
app.use("/api/interests", interestRoutes);

app.get("/", (req, res) => {
  res.send("Auth backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});