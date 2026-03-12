const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

/**
 * Calculate working days between two dates (inclusive), excluding weekends.
 */
const calcWorkingDays = (startDate, endDate) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isSameOrBefore(end, "day")) {
    const day = current.day(); // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) count++;
    current = current.add(1, "day");
  }
  return count;
};

/**
 * Format a date to YYYY-MM-DD string.
 */
const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

/**
 * Format a datetime to ISO string.
 */
const formatDateTime = (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

/**
 * Check whether a date string is valid.
 */
const isValidDate = (dateStr) => dayjs(dateStr, "YYYY-MM-DD", true).isValid();

/**
 * Check whether startDate is before or equal to endDate.
 */
const isDateRangeValid = (startDate, endDate) =>
  dayjs(startDate).isSameOrBefore(dayjs(endDate), "day");

module.exports = {
  calcWorkingDays,
  formatDate,
  formatDateTime,
  isValidDate,
  isDateRangeValid,
  dayjs,
};
