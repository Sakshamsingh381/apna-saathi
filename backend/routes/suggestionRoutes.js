const express = require("express");

const { getTodaySuggestion } = require("../controllers/suggestionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/today", protect, getTodaySuggestion);

module.exports = router;