/**
 * Send a standardised success response.
 */
const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

/**
 * Send a standardised error response.
 */
const sendError = (res, message = "An error occurred", statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });

module.exports = { sendSuccess, sendError };
