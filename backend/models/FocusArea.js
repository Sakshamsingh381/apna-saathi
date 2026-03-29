const mongoose = require("mongoose");

const focusAreaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    transformation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transformation",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    weight: {
      type: Number,
      required: true
    },

    isCompleted: {
      type: Boolean,
      default: false
    },

    completionRule: {
      type: String,
      enum: ["manual", "goal_count"],
      default: "manual"
    },

    requiredCompletedGoals: {
      type: Number,
      default: 1
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("FocusArea", focusAreaSchema);