const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getHeatmap } = require("../controllers/heatmapController");

router.get("/", protect, getHeatmap);

module.exports = router;