const Task = require("../models/Task");

const getHeatmap = async (req, res) => {

  try {

    const days = [];

    for (let i = 6; i >= 0; i--) {

      const date = new Date();
      date.setDate(date.getDate() - i);

      const start = new Date(date);
      start.setHours(0,0,0,0);

      const end = new Date(date);
      end.setHours(23,59,59,999);

      const count = await Task.countDocuments({
        user: req.user._id,
        plannedDate: { $gte: start, $lte: end },
        status: "completed"
      });

      const dayName = date.toLocaleDateString("en-US", {
        weekday: "short"
      });

      days.push({
        day: dayName,
        count
      });

    }

    res.json({
      success: true,
      heatmap: days
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Heatmap generation failed"
    });

  }

};

module.exports = { getHeatmap };