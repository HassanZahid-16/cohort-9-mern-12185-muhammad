const authService = require("../services/authService");
const {
  validateRegistration,
  validateLogin,
} = require("../validators/authValidator");

const register = async (req, res, next) => {
  try {
    const validationError = validateRegistration(req.body);
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }
    const user = await authService.registerUser(req.body);
    req.log.info(
      {
        userId: user.id,
      },
      "User registration completed."
    );
    return res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validationError = validateLogin(req.body);
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }
    const result = await authService.loginUser(req.body);
    req.log.info(
      {
        userId: result.user.id,
      },
      "User login completed."
    );
    return res.status(200).json({
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {register,login,};