const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({origin: "http://localhost:5173",}));
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