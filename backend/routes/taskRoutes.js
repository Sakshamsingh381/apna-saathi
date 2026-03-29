const express = require("express");

const {
  createTask,
  getTasksByDate,
  updateTaskStatus,
  getDailyScore,
  getWeeklyScore,
  getStreak,
  getMissedDay,
  deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Create a task
 */
router.post("/", protect, createTask);

/**
 * Get tasks by date
 * Example: /api/tasks?date=2026-03-06
 */
router.get("/", protect, getTasksByDate);

/**
 * Productivity analytics
 */
router.get("/daily-score", protect, getDailyScore);
router.get("/weekly-score", protect, getWeeklyScore);
router.get("/streak", protect, getStreak);
router.get("/missed-day", protect, getMissedDay);

/**
 * Update task status (complete / pending)
 */
router.patch("/:id", protect, updateTaskStatus);

/**
 * DELETE TASK
 */
router.delete("/:id", protect, deleteTask);

module.exports = router;