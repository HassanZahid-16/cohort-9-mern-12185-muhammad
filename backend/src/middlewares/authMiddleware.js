const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.notes_app_token;
  if (!token) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }
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