const originMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    return next();
  }
  const allowedOrigin = process.env.FRONTEND_URL;
  const requestOrigin = req.get("Origin");
  if (!allowedOrigin || requestOrigin !== allowedOrigin) {
    return res.status(403).json({
      message: "Request origin is not allowed.",
    });
  }
  next();
};

module.exports = originMiddleware;