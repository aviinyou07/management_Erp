require("dotenv").config();
const express = require("express");

const authRoutes    = require("./routes/auth.routes");
const leaveRoutes   = require("./routes/leave.routes");
const holidayRoutes = require("./routes/holiday.routes");

const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ─────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ success: true, message: "HR Leave API is running." })
);

// ── API Routes ────────────────────────────────────────────────
app.use("/auth",     authRoutes);
app.use("/leave",    leaveRoutes);
app.use("/holidays", holidayRoutes);

// ── 404 + error handler ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 HR Leave API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
