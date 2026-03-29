const express = require("express");
const router = express.Router();

const FocusArea = require("../models/FocusArea");
const Goal = require("../models/Goal");
const Task = require("../models/Task");
const Transformation = require("../models/Transformation");
const protect = require("../middleware/authMiddleware");


/*
================ CREATE FOCUS AREA =================
*/
router.post("/", protect, async (req, res) => {
  try {

    const { name, weight, completionRule, requiredCompletedGoals } = req.body;

    if (!name || weight === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and weight required"
      });
    }

    // ✅ FIX: support BOTH draft + active
    const transformation = await Transformation.findOne({
      user: req.user._id,
      status: { $in: ["draft", "active"] }
    });

    if (!transformation) {
      return res.status(400).json({
        success: false,
        message: "No transformation found"
      });
    }

    const cleanName = name.trim().toLowerCase();

    const existingFocus = await FocusArea.findOne({
      user: req.user._id,
      transformation: transformation._id,
      name: cleanName
    });

    if (existingFocus) {
      return res.status(400).json({
        success: false,
        message: "Focus area already exists"
      });
    }

    const focusArea = await FocusArea.create({
      user: req.user._id,
      name: cleanName,
      weight,
      transformation: transformation._id,

      // ✅ SAFE DEFAULTS (no break)
      completionRule: completionRule || "manual",
      requiredCompletedGoals: requiredCompletedGoals || 1,
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      focusArea
    });

  } catch (error) {
    console.error("CREATE FOCUS AREA ERROR:", error);
    res.status(500).json({ success: false });
  }
});


/*
================ GET FOCUS AREAS =================
*/
router.get("/", protect, async (req, res) => {
  try {

    const transformation = await Transformation.findOne({
      user: req.user._id,
      status: { $in: ["draft", "active"] }
    });

    if (!transformation) {
      return res.status(200).json({
        success: true,
        focusAreas: []
      });
    }

    const focusAreas = await FocusArea.find({
      user: req.user._id,
      transformation: transformation._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      focusAreas
    });

  } catch (error) {
    console.error("GET FOCUS AREA ERROR:", error);
    res.status(500).json({ success: false });
  }
});


/*
================ COMPLETE FOCUS AREA =================
*/
router.patch("/complete/:id", protect, async (req, res) => {
  try {

    const focusArea = await FocusArea.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!focusArea) {
      return res.status(404).json({
        success: false,
        message: "Focus area not found"
      });
    }

    focusArea.isCompleted = true;

    await focusArea.save();

    res.status(200).json({
      success: true,
      focusArea
    });

  } catch (error) {
    console.error("COMPLETE FOCUS AREA ERROR:", error);
    res.status(500).json({ success: false });
  }
});


/*
================ DELETE FOCUS AREA (CASCADE) =================
*/
router.delete("/:id", protect, async (req, res) => {
  try {

    const focusArea = await FocusArea.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!focusArea) {
      return res.status(404).json({
        success: false,
        message: "Focus area not found"
      });
    }

    // 🔥 get all goals under this focus area
    const goals = await Goal.find({
      focusArea: focusArea._id
    });

    const goalIds = goals.map(g => g._id);

    // 🔥 delete tasks
    await Task.deleteMany({
      goal: { $in: goalIds }
    });

    // 🔥 delete goals
    await Goal.deleteMany({
      focusArea: focusArea._id
    });

    // 🔥 delete focus area
    await FocusArea.deleteOne({
      _id: focusArea._id
    });

    res.status(200).json({
      success: true,
      message: "Focus area, goals, and tasks deleted"
    });

  } catch (error) {
    console.error("DELETE FOCUS AREA ERROR:", error);
    res.status(500).json({ success: false });
  }
});


module.exports = router;