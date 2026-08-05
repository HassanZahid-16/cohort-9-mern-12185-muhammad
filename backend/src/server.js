require("dotenv").config();
const connectDatabase = require("./config/database");
const logger = require("./config/logger");
const app = require("./app");
const DEFAULT_PORT = 5000;

let PORT = DEFAULT_PORT;
if (process.env.PORT !== undefined) {
  const parsedPort = Number(process.env.PORT);
  if (
    !Number.isInteger(parsedPort) ||
    parsedPort < 1 ||
    parsedPort > 65535
  ) {
    logger.error("Invalid PORT value in .env file.");
    process.exit(1);
  }
  PORT = parsedPort;
}
if (
  process.env.NODE_ENV === "production" &&
  (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "your_jwt_secret_here"
  )
) {
  logger.error("A valid JWT_SECRET must be configured.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDatabase();
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
    server.on("error", (error) => {
      logger.error({
        err: error,
      }, "Server startup failed.");
      process.exit(1);
    });
  } catch (error) {
    logger.error({
      err: error,
    }, "Server startup failed.");
    process.exit(1);
  }
};

startServer();