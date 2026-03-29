require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const goalRoutes = require("./routes/goalRoutes");
const insightRoutes = require("./routes/insightRoutes");
const reflectionRoutes = require("./routes/reflectionRoutes");
const transformationRoutes = require("./routes/transformationRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const heatmapRoutes = require("./routes/heatmapRoutes");
const focusAreaRoutes = require("./routes/focusAreaRoutes");

const startGoalExpirationJob = require("./utils/goalExpirationJob");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Cron Job
startGoalExpirationJob();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/reflections", reflectionRoutes);
app.use("/api/transformation", transformationRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/heatmap", heatmapRoutes);
app.use("/api/focusareas", focusAreaRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Apna Saathi server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});