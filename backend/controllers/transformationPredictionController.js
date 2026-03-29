const Transformation = require("../models/Transformation");
const Task = require("../models/Task");
const Goal = require("../models/Goal");

const getTransformationPrediction = async (req, res) => {
  try {
    const userId = req.user._id;

    const transformation = await Transformation.findOne({
      user: userId,
      status: "active"
    });

    if (!transformation) {
      return res.status(400).json({
        success: false,
        message: "No active transformation"
      });
    }

    const today = new Date();

    // ================= LAST 7 DAYS =================
    let completedLast7Days = 0;
    let activeDays = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const start = new Date(d);
      start.setHours(0, 0, 0, 0);

      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const count = await Task.countDocuments({
        user: userId,
        plannedDate: { $gte: start, $lte: end },
        status: "completed"
      });

      if (count > 0) activeDays++;
      completedLast7Days += count;
    }

    // 🔥 FIXED DAILY AVG (ONLY CHANGE)
    const totalCompleted = await Task.countDocuments({
      user: userId,
      status: "completed"
    });

    const days = Math.max(
      Math.ceil(
        (new Date() - new Date(transformation.createdAt)) /
        (1000 * 60 * 60 * 24)
      ),
      1
    );

    const dailyAvg = totalCompleted / days;

    // ================= GOAL BASED =================
    const goals = await Goal.find({ user: userId });

    let totalRequiredTasks = 0;
    let completedTasks = 0;

    for (const goal of goals) {
      const tasks = await Task.find({
        user: userId,
        goal: goal._id
      });

      const done = tasks.filter(
        t => t.status === "completed"
      ).length;

      const required =
        goal.requiredTasks && goal.requiredTasks > 0
          ? goal.requiredTasks
          : tasks.length || 1;

      totalRequiredTasks += required;
      completedTasks += done;
    }

    const remainingTasks = Math.max(
      totalRequiredTasks - completedTasks,
      0
    );

    // ================= PREDICTION =================
    let prediction = "No activity";
    let predictedDays = null;
    let completionDate = null;
    let suggestion = "Start working";

    if (dailyAvg > 0 || completedTasks > 0) {

      const safeAvg = dailyAvg === 0 ? 1 : dailyAvg;

      if (remainingTasks > 0) {
        predictedDays = Math.ceil(remainingTasks / safeAvg);
      } else {
        const idealDaily = 2;
        predictedDays = Math.ceil(idealDaily / safeAvg);
      }

      if (!predictedDays || predictedDays <= 0) {
        predictedDays = 1;
      }

      completionDate = new Date();
      completionDate.setDate(
        completionDate.getDate() + predictedDays
      );

      if (safeAvg >= 3) {
        prediction = "Strong Momentum";
        suggestion = "Excellent consistency. Keep pushing";
      } 
      else if (safeAvg >= 1.5) {
        prediction = "On Track";
        suggestion = "Good progress. Stay consistent";
      } 
      else {
        prediction = "Slow Progress";
        suggestion = "Increase consistency. Try 2 tasks per day";
      }

    } else {
      prediction = "No activity";
      suggestion = "Start taking action";
    }

    res.json({
      success: true,
      prediction,
      predictedDays,
      completionDate,
      suggestion,
      remainingTasks,
      dailyAvg: Math.round(dailyAvg),
      completedTasks,
      totalRequiredTasks
    });

  } catch (error) {
    console.error("Prediction error:", error);

    res.status(500).json({
      success: false,
      message: "Prediction failed"
    });
  }
};

module.exports = {
  getTransformationPrediction
};