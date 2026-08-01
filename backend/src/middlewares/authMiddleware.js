const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }
  const parts = authorizationHeader.trim().split(/\s+/);
  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer" ||
    !parts[1]
  ) {
    return res.status(401).json({
      message: "Invalid authentication token.",
    });
  }
  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication token is invalid or expired.",
    });
  }
};

module.exports = authenticate;