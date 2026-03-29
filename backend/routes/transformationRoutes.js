const express = require("express");

const {
  createTransformation,
  getCurrentTransformation,
  addFocusArea,
  activateTransformation,
  getTransformationPrediction   // ✅ ADDED
} = require("../controllers/transformationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Create transformation (draft)
 */
router.post("/", protect, createTransformation);

/**
 * Get current transformation
 */
router.get("/current", protect, getCurrentTransformation);

/**
 * Add focus area to draft transformation
 */
router.post("/focus-areas", protect, addFocusArea);

/**
 * Activate transformation
 */
router.patch("/activate", protect, activateTransformation);

/**
 * 🔥 NEW: Prediction route
 */
router.get("/prediction", protect, getTransformationPrediction);

module.exports = router;