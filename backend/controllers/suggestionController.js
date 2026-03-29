const Task = require("../models/Task");

const getTodaySuggestion = async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const totalTasks = await Task.countDocuments({
      user: req.user._id,
      plannedDate: { $gte: today, $lte: end }
    });

    const completedTasks = await Task.countDocuments({
      user: req.user._id,
      plannedDate: { $gte: today, $lte: end },
      status: "completed"
    });

    let message = "";

    if (totalTasks === 0) {

      message = "You haven't planned any tasks today. Start with one small step.";

    } 
    else {

      const score = Math.round((completedTasks / totalTasks) * 100);

      if (score >= 80) {

        message = "Great work today. You're building strong consistency.";

      } 
      else if (score >= 50) {

        message = "You're doing okay. Try finishing a few more tasks.";

      } 
      else {

        message = "Your progress is slow today. Focus on completing one important task.";

      }

    }

    res.status(200).json({
      success: true,
      suggestion: message
    });

  } catch (error) {

    console.error("SUGGESTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate suggestion"
    });

  }
};

module.exports = {
  getTodaySuggestion
};