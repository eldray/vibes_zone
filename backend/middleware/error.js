const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  sendResponse(res, 500, "Server error", null, err.message);
};
