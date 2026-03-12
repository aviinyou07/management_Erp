const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();

const {
  getBalance,
  applyLeave,
  getMyRequests,
  getAllRequests,
  updateStatus,
  getCalendar,
  downloadSummary,
} = require("../controllers/leave.controller");

const { authenticate, authorizeAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

// All leave routes require authentication
router.use(authenticate);

// ── GET /leave/balance ────────────────────────────────────────
router.get("/balance", getBalance);

// ── POST /leave/apply ─────────────────────────────────────────
router.post(
  "/apply",
  [
    body("leaveType")
      .notEmpty().withMessage("Leave type is required.")
      .isIn(["Annual", "Sick", "Casual", "LWOP"]).withMessage("Leave type must be Annual, Sick, Casual, or LWOP."),
    body("startDate")
      .notEmpty().withMessage("Start date is required.")
      .isDate({ format: "YYYY-MM-DD" }).withMessage("Start date must be YYYY-MM-DD."),
    body("endDate")
      .notEmpty().withMessage("End date is required.")
      .isDate({ format: "YYYY-MM-DD" }).withMessage("End date must be YYYY-MM-DD.")
      .custom((endDate, { req }) => {
        if (new Date(endDate) < new Date(req.body.startDate)) {
          throw new Error("End date must be on or after start date.");
        }
        return true;
      }),
    body("reason")
      .trim()
      .notEmpty().withMessage("Reason is required.")
      .isLength({ min: 5, max: 500 }).withMessage("Reason must be 5–500 characters."),
  ],
  validate,
  applyLeave
);

// ── GET /leave/my-requests ────────────────────────────────────
router.get("/my-requests", getMyRequests);

// ── GET /leave/all-requests  (admin) ─────────────────────────
router.get(
  "/all-requests",
  authorizeAdmin,
  [
    query("status")
      .optional()
      .isIn(["Pending", "Approved", "Rejected"]).withMessage("Invalid status filter."),
  ],
  validate,
  getAllRequests
);

// ── PATCH /leave/update-status/:leaveId  (admin) ─────────────
router.patch(
  "/update-status/:leaveId",
    authorizeAdmin,
    [
      param("leaveId")
        .isInt({ min: 1 }).withMessage("Leave ID must be a positive integer."),
      body("status")
        .notEmpty().withMessage("Status is required.")
        .isIn(["Approved", "Rejected"]).withMessage("Status must be Approved or Rejected."),
    ],
  validate,
  updateStatus
);

// ── GET /leave/calendar ───────────────────────────────────────
router.get("/calendar", getCalendar);

// ── GET /leave/summary/download ───────────────────────────────
router.get(
  "/summary/download",
  [
    query("format")
      .optional()
      .isIn(["pdf", "excel", "xlsx"]).withMessage("Format must be pdf or excel."),
  ],
  validate,
  downloadSummary
);

module.exports = router;
