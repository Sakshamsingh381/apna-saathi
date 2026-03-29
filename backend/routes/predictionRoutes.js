const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getTransformationPrediction
} = require("../controllers/transformationPredictionController");

const router = express.Router();

router.get("/", protect, getTransformationPrediction);

module.exports = router;