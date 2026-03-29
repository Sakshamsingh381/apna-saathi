const mongoose = require("mongoose");

const reflectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mood: {
      type: Number,
      required: true
    },

    energy: {
      type: Number,
      required: true
    },

    notes: {
      type: String,
      default: ""
    },

    // 🔥 ADD THIS (IMPORTANT FIX)
    date: {
      type: Date,
      required: true
    }

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reflection", reflectionSchema);