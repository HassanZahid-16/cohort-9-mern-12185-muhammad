const crypto = require("node:crypto");
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
    res.cookie("notes_app_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    const csrfToken = crypto.randomBytes(32).toString("hex");
    res.cookie("notes_app_csrf", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful.",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("notes_app_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.clearCookie("notes_app_csrf", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({
    message: "Logout successful.",
  });
};

module.exports = { register, login, me, logout };