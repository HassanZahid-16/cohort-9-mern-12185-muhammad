const bcrypt = require("bcrypt");
const AppError = require("./AppError");

const SALT_ROUNDS = 10;

const hashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    throw new AppError(
      "Unable to process password.",
      500
    );
  }
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(
      plainPassword,
      hashedPassword
    );
  } catch (error) {
    throw new AppError(
      "Unable to process password.",
      500
    );
  }
};

module.exports = {hashPassword,comparePassword,};