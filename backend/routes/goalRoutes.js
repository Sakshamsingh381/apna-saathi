const express = require("express");
const router = express.Router();

const Goal = require("../models/Goal");
const protect = require("../middleware/authMiddleware");


// ================= CREATE =================
router.post("/", protect, async (req, res) => {
  try {

    const { title, focusArea, deadline, requiredTasks } = req.body;

    if (!title || !focusArea || !deadline) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      focusArea,
      deadline,
      requiredTasks: requiredTasks || 5   // 🔥 FIX
    });

    res.status(201).json({
      success: true,
      goal
    });

  } catch (error) {
    console.error("CREATE GOAL ERROR:", error);
    res.status(500).json({ success: false });
  }
});


// ================= GET =================
router.get("/", protect, async (req, res) => {
  try {

    const goals = await Goal.find({
      user: req.user._id
    }).populate("focusArea");

    res.json({
      success: true,
      goals
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});


// ================= COMPLETE GOAL (NEW) =================
router.patch("/complete/:id", protect, async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found"
      });
    }

    goal.isCompleted = true;
    goal.status = "completed";

    await goal.save();

    res.json({
      success: true,
      goal
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});


// ================= DELETE =================
router.delete("/:id", protect, async (req, res) => {
  try {

    await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;