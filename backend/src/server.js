require("dotenv").config();
const connectDatabase = require("./config/database");
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
    console.error("Invalid PORT value in .env file.");
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
  console.error("A valid JWT_SECRET must be configured.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDatabase();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.on("error", (error) => {
      console.error("Server startup failed.", {
        name: error.name,
        message: error.message,
      });
      process.exit(1);
    });
  } catch (error) {
    console.error("Server startup failed.");
    process.exit(1);
  }
};

startServer();