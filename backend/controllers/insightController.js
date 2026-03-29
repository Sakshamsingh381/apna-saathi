const Task = require("../models/Task");
const Goal = require("../models/Goal");
const FocusArea = require("../models/FocusArea");
const Transformation = require("../models/Transformation");
const Reflection = require("../models/Reflection");

// ================= HELPER =================
const calculateDailyScore = async (userId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  const total = await Task.countDocuments({
    user: userId,
    plannedDate: { $gte: start, $lte: end }
  });

  const completed = await Task.countDocuments({
    user: userId,
    plannedDate: { $gte: start, $lte: end },
    status: "completed"
  });

  if (total === 0) return 0;

  return Math.round((completed / total) * 100);
};

// ================= DASHBOARD =================
const getDashboardInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();

    // ===== DAILY =====
    const dailyScore = await calculateDailyScore(userId, today);

    // ===== WEEKLY =====
    let weeklyScores = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const score = await calculateDailyScore(userId, d);
      weeklyScores.push(score);
    }

    // CONSISTENCY BASED
    const daysWorked = weeklyScores.filter(s => s > 0).length;
    const weeklyScore = Math.round((daysWorked / 7) * 100);

    const weeklyPerformanceAverage = Math.round(
      weeklyScores.reduce((a, b) => a + b, 0) / 7
    );

    // ===== STREAK =====
    let currentStreak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const score = await calculateDailyScore(userId, d);

      if (score > 0) currentStreak++;
      else break;
    }

    // ===== TODAY TASKS =====
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayTasks = await Task.find({
      user: userId,
      plannedDate: { $gte: start, $lte: end }
    });

    // ===== MOOD TREND =====
    let moodTrend = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const ref = await Reflection.findOne({
        user: userId,
        createdAt: { $gte: d }
      });

      moodTrend.push(ref ? ref.mood : 0);
    }

    let emotionalTrend = "stable";

    if (moodTrend[6] > moodTrend[5]) emotionalTrend = "upward";
    else if (moodTrend[6] < moodTrend[5]) emotionalTrend = "downward";

    // ===== TRANSFORMATION =====
    let transformationProgress = 0;
    let focusAreasData = [];

    const transformation = await Transformation.findOne({
      user: userId,
      status: "active"
    });

    if (transformation) {
      const focusAreas = await FocusArea.find({
        user: userId,
        transformation: transformation._id
      });

      let totalWeight = 0;
      let weightedSum = 0;

      for (const area of focusAreas) {
        let progress = 0;

        if (area.isCompleted) {
          progress = 100;
        } else {
          const goals = await Goal.find({
            user: userId,
            focusArea: area._id
          });

          let completedGoalsCount = 0;

          for (const goal of goals) {
            const tasks = await Task.find({
              user: userId,
              goal: goal._id
            });

            const completedTasks = tasks.filter(
              t => t.status === "completed"
            ).length;

            const required =
              goal.requiredTasks && goal.requiredTasks > 0
                ? goal.requiredTasks
                : tasks.length || 1;

            const goalProgress = Math.min(
              100,
              Math.round((completedTasks / required) * 100)
            );

            if (goalProgress === 100 && !goal.isCompleted) {
              goal.isCompleted = true;
              goal.status = "completed";
              await goal.save();
            }

            if (goal.isCompleted) completedGoalsCount++;
          }

          progress =
            area.completionRule === "goal_count"
              ? Math.min(
                  100,
                  Math.round(
                    (completedGoalsCount /
                      (area.requiredCompletedGoals || 1)) *
                      100
                  )
                )
              : 0;

          if (progress === 100 && !area.isCompleted) {
            area.isCompleted = true;
            await area.save();
          }
        }

        focusAreasData.push({
          name: area.name,
          progress
        });

        totalWeight += area.weight;
        weightedSum += progress * area.weight;
      }

      transformationProgress =
        totalWeight === 0
          ? 0
          : Math.round(weightedSum / totalWeight);
    }

    // ================= 🔥 PREDICTION ENGINE =================

    const last7Start = new Date();
    last7Start.setDate(today.getDate() - 6);
    last7Start.setHours(0,0,0,0);

    const last7Completed = await Task.countDocuments({
      user: userId,
      status: "completed",
      updatedAt: { $gte: last7Start, $lte: today }
    });

    const pace = last7Completed / 7;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "completed"
    });

    const remainingTasks = totalTasks - completedTasks;

    let predictedDays;

if (remainingTasks <= 0) {
  // ✅ USER ALREADY COMPLETED ALL TASKS
  predictedDays = Math.ceil(7 / (pace || 1)); 
} else if (pace > 0) {
  predictedDays = Math.ceil(remainingTasks / pace);
} else {
  predictedDays = 7; // fallback
}

// ✅ HARD SAFETY (NEVER 0)
if (!predictedDays || predictedDays <= 0) {
  predictedDays = 1;
}
    let predictionStatus = "Slow Progress";
    if (pace >= 2) predictionStatus = "Strong Momentum";
    else if (pace >= 1) predictionStatus = "On Track";

    const completionDate = new Date();
    completionDate.setDate(today.getDate() + predictedDays);

    const suggestion =
      pace < 1
        ? "Increase consistency. Try 2 tasks per day"
        : pace < 2
        ? "Good progress. Push slightly more"
        : "Excellent pace. Keep it up";

    // ===== STATE =====
    let overallState = "unstable";

    if (weeklyPerformanceAverage >= 70) overallState = "strong growth";
    else if (weeklyPerformanceAverage >= 50)
      overallState = "stable improving";
    else if (weeklyPerformanceAverage < 40)
      overallState = "risk zone";

    res.json({
      success: true,
      dailyScore,
      weeklyScore,
      currentStreak,
      todayTasks,
      trends: weeklyScores,
      moodTrend,
      emotionalTrend,
      transformationProgress,
      focusAreas: focusAreasData,
      weeklyPerformanceAverage,
      overallState,

      // 🔥 NEW
      prediction: {
        status: predictionStatus,
        daysLeft: predictedDays,
        completionDate,
        suggestion
      }
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  getDashboardInsights
};