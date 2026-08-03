const AppError = require("../utils/AppError");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateAccessToken } = require("../utils/jwt");

const registerUser = async ({ fullName, email, password }) => {
  try {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new AppError(
        "Email is already registered.",
        409
      );
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.code === 11000) {
      throw new AppError(
        "Email is already registered.",
        409
      );
    }
    throw new AppError(
      "Internal server error.",
      500
    );
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) {
      throw new AppError(
        "Invalid email or password.",
        401
      );
    }
    const passwordMatched = await comparePassword(
      password,
      user.password
    );
    if (!passwordMatched) {
      throw new AppError(
        "Invalid email or password.",
        401
      );
    }
    return {
      token: generateAccessToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Internal server error.",
      500
    );
  }
};

module.exports = {registerUser,loginUser,};