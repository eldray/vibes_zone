const passport = require("passport");
const { sendResponse } = require("../utils/response");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return sendResponse(
        res,
        401,
        "Unauthorized",
        null,
        info?.message || "Invalid token"
      );
    }
    req.user = user;
    next();
  })(req, res, next);
};
