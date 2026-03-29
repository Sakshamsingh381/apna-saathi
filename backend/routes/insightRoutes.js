const express = require("express");
const { getDashboardInsights } = require("../controllers/insightController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, getDashboardInsights);

module.exports = router;