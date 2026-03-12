const db = require("../config/db");
const { calcWorkingDays } = require("../utils/date.utils");

// ─────────────────────────────────────────────────────────────
// LEAVE BALANCE
// ─────────────────────────────────────────────────────────────

/**
 * Return formatted leave balance for a user.
 */
const getLeaveBalance = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM leave_balance WHERE user_id = ?",
    [userId]
  );

  if (rows.length === 0) {
    const err = new Error("Leave balance record not found. Please contact HR.");
    err.statusCode = 404;
    throw err;
  }

  const b = rows[0];
  return {
    annualLeave: {
      total: b.annual_total,
      used: b.annual_used,
      remaining: b.annual_total - b.annual_used,
    },
    sickLeave: {
      total: b.sick_total,
      used: b.sick_used,
      remaining: b.sick_total - b.sick_used,
    },
    casualLeave: {
      total: b.casual_total,
      used: b.casual_used,
      remaining: b.casual_total - b.casual_used,
    },
    lwop: { used: b.lwop_used },
  };
};

// ─────────────────────────────────────────────────────────────
// APPLY LEAVE
// ─────────────────────────────────────────────────────────────

/**
 * Check for overlapping approved/pending leaves.
 */
const checkOverlap = async (userId, startDate, endDate, excludeId = null) => {
  let sql = `
    SELECT id FROM leaves
    WHERE user_id = ?
      AND status IN ('Pending','Approved')
      AND start_date <= ?
      AND end_date   >= ?
  `;
  const params = [userId, endDate, startDate];

  if (excludeId) {
    sql += " AND id != ?";
    params.push(excludeId);
  }

  const [rows] = await db.query(sql, params);
  return rows.length > 0;
};

/**
 * Validate and apply for leave.
 */
const applyLeave = async (userId, { leaveType, startDate, endDate, reason }) => {
  // Duration
  const duration = calcWorkingDays(startDate, endDate);
  if (duration < 1) {
    const err = new Error("Leave duration must be at least 1 working day.");
    err.statusCode = 400;
    throw err;
  }

  // Overlap check
  const hasOverlap = await checkOverlap(userId, startDate, endDate);
  if (hasOverlap) {
    const err = new Error(
      "You already have a leave request overlapping with the selected dates."
    );
    err.statusCode = 409;
    throw err;
  }

  // Balance check (LWOP has no limit)
  if (leaveType !== "LWOP") {
    const [balRows] = await db.query(
      "SELECT annual_total, annual_used, sick_total, sick_used, casual_total, casual_used FROM leave_balance WHERE user_id = ?",
      [userId]
    );

    if (balRows.length === 0) {
      const err = new Error("Leave balance not initialised for this user.");
      err.statusCode = 400;
      throw err;
    }

    const b = balRows[0];
    const balanceMap = {
      Annual: b.annual_total - b.annual_used,
      Sick: b.sick_total - b.sick_used,
      Casual: b.casual_total - b.casual_used,
    };

    const available = balanceMap[leaveType];
    if (available === undefined) {
      const err = new Error("Invalid leave type.");
      err.statusCode = 400;
      throw err;
    }

    if (duration > available) {
      const err = new Error(
        `Insufficient ${leaveType} leave balance. Available: ${available} day(s), Requested: ${duration} day(s).`
      );
      err.statusCode = 400;
      throw err;
    }
  }

  const [result] = await db.query(
    `INSERT INTO leaves (user_id, leave_type, start_date, end_date, duration, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
    [userId, leaveType, startDate, endDate, duration, reason]
  );

  return {
    id: result.insertId,
    leaveType,
    startDate,
    endDate,
    duration,
    reason,
    status: "Pending",
    appliedOn: new Date().toISOString(),
  };
};

// ─────────────────────────────────────────────────────────────
// VIEW REQUESTS
// ─────────────────────────────────────────────────────────────

/**
 * Get all leave requests for a specific user.
 */
const getMyRequests = async (userId) => {
  const [rows] = await db.query(
    `SELECT
       id,
       leave_type  AS leaveType,
       reason,
       start_date  AS startDate,
       end_date    AS endDate,
       duration,
       applied_on  AS appliedOn,
       status
     FROM leaves
     WHERE user_id = ?
     ORDER BY applied_on DESC`,
    [userId]
  );
  return rows;
};

/**
 * Admin: get ALL leave requests (optionally filtered by status).
 */
const getAllRequests = async (status = null) => {
  let sql = `
    SELECT
      l.id,
      u.name        AS employeeName,
      u.department,
      l.leave_type  AS leaveType,
      l.reason,
      l.start_date  AS startDate,
      l.end_date    AS endDate,
      l.duration,
      l.applied_on  AS appliedOn,
      l.status
    FROM leaves l
    JOIN users  u ON u.id = l.user_id
  `;
  const params = [];

  if (status) {
    sql += " WHERE l.status = ?";
    params.push(status);
  }

  sql += " ORDER BY l.applied_on DESC";
  const [rows] = await db.query(sql, params);
  return rows;
};

// ─────────────────────────────────────────────────────────────
// ADMIN APPROVAL
// ─────────────────────────────────────────────────────────────

/**
 * Admin: approve or reject a leave request.
 * Updates leave_balance on approval.
 */
const updateLeaveStatus = async (leaveId, status, adminId) => {
  // Fetch the leave record
  const [leaves] = await db.query("SELECT * FROM leaves WHERE id = ?", [leaveId]);
  if (leaves.length === 0) {
    const err = new Error("Leave request not found.");
    err.statusCode = 404;
    throw err;
  }

  const leave = leaves[0];

  if (leave.status !== "Pending") {
    const err = new Error(
      `Cannot update a leave that is already ${leave.status}.`
    );
    err.statusCode = 400;
    throw err;
  }

  // Update leave status
  await db.query(
    "UPDATE leaves SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?",
    [status, adminId, leaveId]
  );

  // Deduct balance on approval
  if (status === "Approved") {
    const columnMap = {
      Annual: "annual_used",
      Sick:   "sick_used",
      Casual: "casual_used",
      LWOP:   "lwop_used",
    };
    const col = columnMap[leave.leave_type];
    if (col) {
      await db.query(
        `UPDATE leave_balance SET ${col} = ${col} + ? WHERE user_id = ?`,
        [leave.duration, leave.user_id]
      );
    }
  }

  return { leaveId, status };
};

// ─────────────────────────────────────────────────────────────
// CALENDAR
// ─────────────────────────────────────────────────────────────

/**
 * Return approved/pending leaves for a user + holidays for calendar.
 */
const getCalendar = async (userId) => {
  // User's leaves
  const [leaveRows] = await db.query(
    `SELECT
       leave_type AS title,
       start_date AS start,
       end_date   AS end,
       status
     FROM leaves
     WHERE user_id = ?
       AND status IN ('Approved','Pending')`,
    [userId]
  );

  // Public holidays
  const [holidayRows] = await db.query(
    "SELECT name AS title, date AS start, date AS end, 'Holiday' AS status FROM holidays ORDER BY date"
  );

  return [
    ...leaveRows.map((r) => ({ ...r, type: "leave" })),
    ...holidayRows.map((r) => ({ ...r, type: "holiday" })),
  ];
};

// ─────────────────────────────────────────────────────────────
// SUMMARY (raw data for PDF / Excel)
// ─────────────────────────────────────────────────────────────

/**
 * Get full leave summary data for a user.
 */
const getLeaveSummaryData = async (userId) => {
  const [userRows] = await db.query(
    "SELECT name, email, department FROM users WHERE id = ?",
    [userId]
  );

  const [leaveRows] = await db.query(
    `SELECT
       leave_type  AS leaveType,
       start_date  AS startDate,
       end_date    AS endDate,
       duration,
       reason,
       status,
       applied_on  AS appliedOn
     FROM leaves
     WHERE user_id = ?
     ORDER BY applied_on DESC`,
    [userId]
  );

  const [balRows] = await db.query(
    "SELECT * FROM leave_balance WHERE user_id = ?",
    [userId]
  );

  return {
    employee: userRows[0] || {},
    leaves: leaveRows,
    balance: balRows[0] || {},
  };
};

module.exports = {
  getLeaveBalance,
  applyLeave,
  getMyRequests,
  getAllRequests,
  updateLeaveStatus,
  getCalendar,
  getLeaveSummaryData,
};
