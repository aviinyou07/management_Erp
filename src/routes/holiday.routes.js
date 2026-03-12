const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();
const { getHolidays, createHoliday, removeHoliday } = require("../controllers/holiday.controller");
const { authenticate, authorizeAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

// GET /holidays  (public — anyone logged in)
router.get(
  "/",
  authenticate,
  [
    query("year")
      .optional()
      .isInt({ min: 2000, max: 2100 }).withMessage("Year must be between 2000-2100."),
  ],
  validate,
  getHolidays
);

// POST /holidays  (admin only)
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  [
    body("name")
      .trim()
      .notEmpty().withMessage("Holiday name is required.")
      .isLength({ max: 150 }),
    body("date")
      .notEmpty().withMessage("Date is required.")
      .isDate({ format: "YYYY-MM-DD" }).withMessage("Date must be YYYY-MM-DD."),
    body("type")
      .optional()
      .trim()
      .isLength({ max: 100 }),
  ],
  validate,
  createHoliday
);

// DELETE /holidays/:id  (admin only)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  [
    param("id").isInt({ min: 1 }).withMessage("Invalid holiday ID."),
  ],
  validate,
  removeHoliday
);

module.exports = router;
