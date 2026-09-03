const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(requestLogger);
app.use(express.json());

app.get("/health", (req, res) => {
  req.log.info("Health check endpoint accessed.");
  res.status(200).json({
    success: true,
    message: "Backend is running successfully.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(errorHandler);

module.exports = app;