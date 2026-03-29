const express = require("express");
const router = express.Router();

const {
  saveReflection,
  getTodayReflection
} = require("../controllers/reflectionController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, saveReflection);
router.get("/today", protect, getTodayReflection);

module.exports = router;