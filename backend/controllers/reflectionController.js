const Reflection = require("../models/Reflection");

/*
SAVE OR UPDATE REFLECTION (1 PER DAY)
*/
const saveReflection = async (req, res) => {
  try {

    const { mood, energy, notes } = req.body;

    if (mood === undefined || energy === undefined) {
      return res.status(400).json({
        success: false,
        message: "Mood and energy required"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let reflection = await Reflection.findOne({
      user: req.user._id,
      date: today   // ✅ FIXED
    });

    if (reflection) {
      reflection.mood = mood;
      reflection.energy = energy;
      reflection.notes = notes;
      await reflection.save();

      return res.status(200).json({
        success: true,
        message: "Reflection updated",
        reflection
      });
    }

    reflection = await Reflection.create({
      user: req.user._id,
      mood,
      energy,
      notes,
      date: today   // ✅ FIXED
    });

    res.status(201).json({
      success: true,
      message: "Reflection saved",
      reflection
    });

  } catch (error) {
    console.error("SAVE REFLECTION ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/*
GET TODAY REFLECTION
*/
const getTodayReflection = async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reflection = await Reflection.findOne({
      user: req.user._id,
      date: today   // ✅ FIXED
    });

    res.status(200).json({
      success: true,
      reflection
    });

  } catch (error) {
    console.error("GET TODAY REFLECTION ERROR:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  saveReflection,
  getTodayReflection
};