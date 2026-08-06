const mongoose = require("mongoose");
const logger = require("./logger");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Database connection established.");
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Database connection failed."
    );
    process.exit(1);
  }
};

module.exports = connectDatabase;