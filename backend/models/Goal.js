const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  focusArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FocusArea",
    default: null
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  deadline: {
    type: Date,
    required: true
  },

  // 🔥 NEW
  requiredTasks: {
    type: Number,
    default: 5
  },

  // 🔥 NEW
  isCompleted: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);