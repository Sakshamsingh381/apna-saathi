const Transformation = require("../models/Transformation");
const FocusArea = require("../models/FocusArea");
const Task = require("../models/Task");
const Goal = require("../models/Goal");


// ================= CREATE DRAFT TRANSFORMATION =================
const createTransformation = async (req, res) => {
  try {

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Transformation title is required"
      });
    }

    const existingActive = await Transformation.findOne({
      user: req.user._id,
      status: "active"
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: "You already have an active transformation"
      });
    }

    const transformation = await Transformation.create({
      user: req.user._id,
      title: title.trim(),
      description,
      status: "draft"
    });

    res.status(201).json({
      success: true,
      transformation
    });

  } catch (error) {

    console.error("CREATE TRANSFORMATION ERROR:", error);

    res.status(500).json({
      success: false
    });
  }
};


// ================= GET CURRENT TRANSFORMATION =================
const getCurrentTransformation = async (req, res) => {
  try {

    const transformation = await Transformation.findOne({
      user: req.user._id,
      status: { $in: ["draft", "active"] }
    });

    res.status(200).json({
      success: true,
      transformation
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
};


// ================= ADD FOCUS AREA =================
const addFocusArea = async (req, res) => {
  try {

    const { name, weight } = req.body;

    if (!name || weight === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and weight are required"
      });
    }

    const transformation = await Transformation.findOne({
      user: req.user._id,
      status: "draft"
    });

    if (!transformation) {
      return res.status(400).json({
        success: false,
        message: "No draft transformation found"
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
      transformation: transformation._id,
      name: cleanName,
      weight
    });

    res.status(201).json({
      success: true,
      focusArea
    });

  } catch (error) {

    console.error("ADD FOCUS AREA ERROR:", error);

    res.status(500).json({
      success: false
    });
  }
};


// ================= ACTIVATE TRANSFORMATION =================
const activateTransformation = async (req, res) => {
  try {

    const transformation = await Transformation.findOne({
      user: req.user._id,
      status: "draft"
    });

    if (!transformation) {
      return res.status(400).json({
        success: false
      });
    }

    transformation.status = "active";

    await transformation.save();

    res.status(200).json({
      success: true,
      transformation
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
};


// ================= 🔥 NEW: TRANSFORMATION PREDICTION =================
const getTransformationPrediction = async (req, res) => {
  try {

    const userId = req.user._id;
    const today = new Date();

    // ===== LAST 7 DAYS =====
    let completedLast7Days = 0;

    for (let i = 0; i < 7; i++) {

      const d = new Date();
      d.setDate(today.getDate() - i);

      const start = new Date(d);
      start.setHours(0,0,0,0);

      const end = new Date(d);
      end.setHours(23,59,59,999);

      const count = await Task.countDocuments({
        user: userId,
        plannedDate: { $gte: start, $lte: end },
        status: "completed"
      });

      completedLast7Days += count;
    }

    const dailyAvg = completedLast7Days / 7;

    // ===== GOALS =====
    const goals = await Goal.find({ user: userId });

    let totalRequiredTasks = 0;
    let completedTasks = 0;

    for (const goal of goals) {

      const tasks = await Task.find({
        user: userId,
        goal: goal._id
      });

      const done = tasks.filter(t => t.status === "completed").length;

      const required =
        goal.requiredTasks && goal.requiredTasks > 0
          ? goal.requiredTasks
          : tasks.length || 1;

      totalRequiredTasks += required;
      completedTasks += done;
    }

    const remainingTasks = totalRequiredTasks - completedTasks;

    // ===== PREDICTION =====
    let prediction = "No progress trend";
    let predictedDays = null;

    if (dailyAvg > 0) {

      predictedDays = Math.ceil(remainingTasks / dailyAvg);

      if (predictedDays <= 7) prediction = "On Track (Fast)";
      else if (predictedDays <= 30) prediction = "Steady Progress";
      else prediction = "Slow Progress";
    }

    // ===== RECOMMENDATION =====
    let recommendation = "";

    if (dailyAvg === 0) {
      recommendation = "Start completing at least 1 task daily";
    }
    else if (dailyAvg < 1) {
      recommendation = "Increase consistency. Try 2 tasks per day";
    }
    else if (dailyAvg < 3) {
      recommendation = "Good pace. Push slightly harder";
    }
    else {
      recommendation = "Excellent pace. Maintain consistency";
    }

    // ===== COMPLETION DATE =====
    let completionDate = null;

    if (predictedDays) {
      completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + predictedDays);
    }

    res.json({
      success: true,
      prediction,
      predictedDays,
      remainingTasks,
      dailyAvg: Math.round(dailyAvg),
      recommendation,
      completionDate
    });

  } catch (error) {

    console.error("Prediction error:", error);

    res.status(500).json({
      success: false
    });
  }
};


module.exports = {
  createTransformation,
  getCurrentTransformation,
  addFocusArea,
  activateTransformation,
  getTransformationPrediction   // ✅ EXPORT
};