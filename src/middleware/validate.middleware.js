const { validationResult } = require("express-validator");

/**
 * Reads express-validator results and forwards errors to errorHandler.
 * Place this AFTER your validation chain in the route definition.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed.");
    err.type = "validation";
    err.status = 400;
    err.errors = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(err);
  }
  next();
};

module.exports = { validate };
