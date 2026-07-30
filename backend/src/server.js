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

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed.");

    process.exit(1);
  }
};

startServer();