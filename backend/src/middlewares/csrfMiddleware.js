const crypto = require("node:crypto");

const CSRF_COOKIE_NAME = "notes_app_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

const csrfMiddleware = (req, res, next) => {
  const csrfToken = req.cookies[CSRF_COOKIE_NAME];
  if (!csrfToken) {
    return res.status(403).json({
      message: "CSRF token is required.",
    });
  }
  const requestToken = req.get(CSRF_HEADER_NAME);
  if (!requestToken) {
    return res.status(403).json({
      message: "CSRF token is required.",
    });
  }
  const tokenBuffer = Buffer.from(csrfToken);
  const requestTokenBuffer = Buffer.from(requestToken);
  if (
    tokenBuffer.length !== requestTokenBuffer.length ||
    !crypto.timingSafeEqual(tokenBuffer, requestTokenBuffer)
  ) {
    return res.status(403).json({
      message: "Invalid CSRF token.",
    });
  }
  next();
};

module.exports = {csrfMiddleware,CSRF_COOKIE_NAME,CSRF_HEADER_NAME,};