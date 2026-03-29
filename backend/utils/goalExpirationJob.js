const cron = require("node-cron");
const Goal = require("../models/Goal");

// Runs every day at midnight
const startGoalExpirationJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      const result = await Goal.updateMany(
        {
          status: "active",
          deadline: { $lt: now }
        },
        {
          status: "expired"
        }
      );

      console.log(`Goal expiration job ran. Updated ${result.modifiedCount} goals.`);
    } catch (error) {
      console.error("Error running goal expiration job:", error);
    }
  });
};

module.exports = startGoalExpirationJob;
