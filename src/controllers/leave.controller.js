const leaveService = require("../services/leave.service");
const exportService = require("../services/export.service");
const { sendSuccess } = require("../utils/response.utils");

// GET /leave/balance
const getBalance = async (req, res, next) => {
  try {
    const data = await leaveService.getLeaveBalance(req.user.id);
    sendSuccess(res, data, "Leave balance fetched.");
  } catch (err) {
    next(err);
  }
};

// POST /leave/apply
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await leaveService.applyLeave(req.user.id, {
      leaveType,
      startDate,
      endDate,
      reason,
    });
    sendSuccess(res, { leave }, "Leave application submitted.", 201);
  } catch (err) {
    next(err);
  }
};

// GET /leave/my-requests
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await leaveService.getMyRequests(req.user.id);
    sendSuccess(res, { requests }, "Leave requests fetched.");
  } catch (err) {
    next(err);
  }
};

// GET /leave/all-requests  (admin)
const getAllRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const requests = await leaveService.getAllRequests(status || null);
    sendSuccess(res, { requests }, "All leave requests fetched.");
  } catch (err) {
    next(err);
  }
};

// PATCH /leave/update-status/:leaveId  (admin)
const updateStatus = async (req, res, next) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;
    const result = await leaveService.updateLeaveStatus(leaveId, status, req.user.id);
    sendSuccess(res, result, `Leave ${status.toLowerCase()} successfully.`);
  } catch (err) {
    next(err);
  }
};

// GET /leave/calendar
const getCalendar = async (req, res, next) => {
  try {
    const events = await leaveService.getCalendar(req.user.id);
    sendSuccess(res, { events }, "Calendar data fetched.");
  } catch (err) {
    next(err);
  }
};

// GET /leave/summary/download?format=pdf|excel
const downloadSummary = async (req, res, next) => {
  try {
    const format = (req.query.format || "pdf").toLowerCase();
    if (format === "excel" || format === "xlsx") {
      await exportService.downloadExcel(req.user.id, res);
    } else {
      await exportService.downloadPDF(req.user.id, res);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBalance,
  applyLeave,
  getMyRequests,
  getAllRequests,
  updateStatus,
  getCalendar,
  downloadSummary,
};
