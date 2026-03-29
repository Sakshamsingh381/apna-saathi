const Goal = require("../models/Goal");
const Task = require("../models/Task");
const FocusArea = require("../models/FocusArea");
const mongoose = require("mongoose");

/**
 * CREATE GOAL
 */
const createGoal = async (req, res) => {
  try {

    const { title, description, deadline, focusArea, requiredTasks } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title and deadline are required"
      });
    }

    let focusAreaId = null;

    // Only try to find focus area if valid ObjectId
    if (focusArea && mongoose.Types.ObjectId.isValid(focusArea)) {

      const existingFocusArea = await FocusArea.findOne({
        _id: focusArea,
        user: req.user._id
      });

      if (existingFocusArea) {
        focusAreaId = existingFocusArea._id;
      }

    }

    const goal = await Goal.create({
      user: req.user._id,
      focusArea: focusAreaId,
      title: title.trim(),
      description,
      deadline,
      requiredTasks: requiredTasks || 5 // 🔥 FIX
    });

    res.status(201).json({
      success: true,
      goal
    });

  } catch (error) {

    console.error("CREATE GOAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * GET ALL GOALS (WITH PROGRESS)
 */
const getGoals = async (req, res) => {
  try {

    const goals = await Goal.find({
      user: req.user._id
    })
    .populate("focusArea", "name")
    .sort({ createdAt: -1 });

    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {

        const tasks = await Task.find({
          user: req.user._id,
          goal: goal._id
        });

        const completedTasks = tasks.filter(
          t => t.status === "completed"
        ).length;

        let progress = Math.round(
          (completedTasks / (goal.requiredTasks || 1)) * 100
        );

        if (progress > 100) progress = 100;

        // 🔥 manual complete override
        if (goal.isCompleted) {
          progress = 100;
        }

        // 🔥 auto complete goal
        if (progress === 100 && goal.status === "active") {
          goal.status = "completed";
          goal.isCompleted = true;
          await goal.save();
        }

        return {
          ...goal.toObject(),
          progress,
          totalTasks: tasks.length,
          completedTasks
        };

      })
    );

    res.status(200).json({
      success: true,
      goals: goalsWithProgress
    });

  } catch (error) {

    console.error("GET GOALS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch goals"
    });
  }
};


/**
 * UPDATE GOAL
 */
const updateGoal = async (req, res) => {
  try {

    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found"
      });
    }

    res.status(200).json({
      success: true,
      goal
    });

  } catch (error) {

    console.error("UPDATE GOAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update goal"
    });
  }
};


/**
 * FOCUS AREA PROGRESS (UNCHANGED — SAFE)
 */
const getFocusProgress = async (req, res) => {
  try {

    const goals = await Goal.find({
      user: req.user._id
    }).populate("focusArea", "name");

    const progressMap = {};

    goals.forEach((goal) => {

      const focusName = goal.focusArea?.name || "Other";

      if (!progressMap[focusName]) {
        progressMap[focusName] = {
          total: 0,
          completed: 0
        };
      }

      progressMap[focusName].total++;

      if (goal.status === "completed") {
        progressMap[focusName].completed++;
      }

    });

    const progress = Object.keys(progressMap).map((focus) => {

      const total = progressMap[focus].total;
      const completed = progressMap[focus].completed;

      return {
        focusArea: focus,
        progress: total === 0 ? 0 : Math.round((completed / total) * 100)
      };

    });

    res.status(200).json({
      success: true,
      progress
    });

  } catch (error) {

    console.error("FOCUS PROGRESS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate focus progress"
    });

  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  getFocusProgress
};