const { getAllHolidays, addHoliday, deleteHoliday } = require("../services/holiday.service");
const { sendSuccess } = require("../utils/response.utils");

// GET /holidays
const getHolidays = async (req, res, next) => {
  try {
    const { year } = req.query;
    const holidays = await getAllHolidays(year || null);
    sendSuccess(res, { holidays }, "Holidays fetched.");
  } catch (err) {
    next(err);
  }
};

// POST /holidays  (admin)
const createHoliday = async (req, res, next) => {
  try {
    const holiday = await addHoliday(req.body);
    sendSuccess(res, { holiday }, "Holiday added.", 201);
  } catch (err) {
    next(err);
  }
};

// DELETE /holidays/:id  (admin)
const removeHoliday = async (req, res, next) => {
  try {
    await deleteHoliday(req.params.id);
    sendSuccess(res, {}, "Holiday deleted.");
  } catch (err) {
    next(err);
  }
};

module.exports = { getHolidays, createHoliday, removeHoliday };
