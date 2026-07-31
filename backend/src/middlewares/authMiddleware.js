const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authentication token.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = {
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