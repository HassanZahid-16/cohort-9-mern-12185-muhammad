const AppError = require("../utils/AppError");
const errorHandler = (error, req, res, next) => {
  console.error(error);
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: isAppError
      ? error.message
      : "Internal server error.",
  });
};

module.exports = errorHandler;