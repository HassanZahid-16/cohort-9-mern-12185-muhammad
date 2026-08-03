const express = require("express");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(errorHandler);

module.exports = app;