const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connection established.");
  } catch (error) {
    console.error("Database connection failed.", {
      name: error.name,
      message: error.message,
    });

    process.exit(1);
  }
};

module.exports = connectDatabase;