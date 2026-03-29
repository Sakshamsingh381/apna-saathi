const Task = require("../models/Task");
const Goal = require("../models/Goal");

/**
 * CREATE TASK
 */
const createTask = async (req, res) => {
  try {
    const { title, plannedDate, description, goal } = req.body;

    if (!title || !plannedDate) {
      return res.status(400).json({
        success: false,
        message: "Title and plannedDate are required"
      });
    }

    const start = new Date(plannedDate);
    start.setHours(0,0,0,0);

    const end = new Date(plannedDate);
    end.setHours(23,59,59,999);

    const existingTask = await Task.findOne({
      user: req.user._id,
      title: title.trim(),
      plannedDate: { $gte: start, $lte: end }
    });

    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: "Task already exists for this date"
      });
    }

    if (goal) {
      const existingGoal = await Goal.findOne({
        _id: goal,
        user: req.user._id
      });

      if (!existingGoal) {
        return res.status(400).json({
          success: false,
          message: "Invalid goal selected"
        });
      }
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description,
      plannedDate,
      goal: goal || null,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      task
    });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Task creation failed"
    });
  }
};


/**
 * GET TASKS BY DATE
 */
const getTasksByDate = async (req, res) => {
  try {

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    const tasks = await Task.find({
      user: req.user._id,
      plannedDate: { $gte: start, $lte: end }
    })
    .populate("goal")
    .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
};


/**
 * ✅ UPDATE TASK STATUS (FIXED — MAIN ISSUE)
 */
const updateTaskStatus = async (req, res) => {
  try {

    let { status } = req.body;

    // 🔥 NORMALIZE STATUS
    if (typeof status === "string") {
      status = status.toLowerCase();
    }

    // 🔥 FORCE ONLY VALID VALUES
    if (status !== "completed") {
      status = "pending";
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
};


/**
 * DELETE TASK
 */
const deleteTask = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {

    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });

  }
};


/**
 * DAILY PRODUCTIVITY SCORE
 */
const getDailyScore = async (req, res) => {
  try {

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

    const totalTasks = await Task.countDocuments({
      user: req.user._id,
      plannedDate: { $gte: todayStart, $lte: todayEnd }
    });

    const completedTasks = await Task.countDocuments({
      user: req.user._id,
      plannedDate: { $gte: todayStart, $lte: todayEnd },
      status: "completed"
    });

    const score =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,
      totalTasks,
      completedTasks,
      score
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate daily score"
    });
  }
};


/**
 * WEEKLY PRODUCTIVITY SCORE
 */
const getWeeklyScore = async (req, res) => {
  try {

    const userId = req.user._id;
    let completedDays = 0;

    for (let i = 0; i < 7; i++) {

      const d = new Date();
      d.setDate(d.getDate() - i);

      const start = new Date(d);
      start.setHours(0,0,0,0);

      const end = new Date(d);
      end.setHours(23,59,59,999);

      const completedTasks = await Task.countDocuments({
        user: userId,
        plannedDate: { $gte: start, $lte: end },
        status: "completed"
      });

      if (completedTasks > 0) {
        completedDays++;
      }
    }

    const weeklyScore = Math.round((completedDays / 7) * 100);

    res.status(200).json({
      success: true,
      weeklyScore
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate weekly score"
    });
  }
};


/**
 * PRODUCTIVITY STREAK
 */
const getStreak = async (req, res) => {
  try {

    let currentStreak = 0;

    for (let i = 0; i < 365; i++) {

      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0,0,0,0);

      const end = new Date(checkDate);
      end.setHours(23,59,59,999);

      const completedTasks = await Task.countDocuments({
        user: req.user._id,
        plannedDate: { $gte: checkDate, $lte: end },
        status: "completed"
      });

      if (completedTasks > 0) {
        currentStreak++;
      } else {
        break;
      }

    }

    res.status(200).json({
      success: true,
      currentStreak
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate streak"
    });
  }
};


/**
 * MISSED DAY DETECTION
 */
const getMissedDay = async (req, res) => {
  try {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0,0,0,0);

    const end = new Date(yesterday);
    end.setHours(23,59,59,999);

    const totalTasks = await Task.countDocuments({
      user: req.user._id,
      plannedDate: { $gte: yesterday, $lte: end }
    });

    const completedTasks = await Task.countDocuments({
      user: req.user._id,
      plannedDate: { $gte: yesterday, $lte: end },
      status: "completed"
    });

    const missed =
      totalTasks > 0 && completedTasks === 0;

    res.status(200).json({
      success: true,
      totalTasksYesterday: totalTasks,
      completedYesterday: completedTasks,
      missed
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to detect missed day"
    });
  }
};


module.exports = {
  createTask,
  getTasksByDate,
  updateTaskStatus,
  deleteTask,
  getDailyScore,
  getWeeklyScore,
  getStreak,
  getMissedDay
};