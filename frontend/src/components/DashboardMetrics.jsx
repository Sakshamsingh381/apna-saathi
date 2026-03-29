import { useEffect, useState } from "react";

const DashboardMetrics = () => {

  const [dailyScore, setDailyScore] = useState(0);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {

    const fetchMetrics = async () => {

      try {

        const token = localStorage.getItem("token");

        const dailyRes = await fetch(
          "http://localhost:5000/api/tasks/daily-score",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dailyData = await dailyRes.json();

        if (dailyData.success) {
          setDailyScore(dailyData.score);
          setTotalTasks(dailyData.totalTasks);
        }

        const weeklyRes = await fetch(
          "http://localhost:5000/api/tasks/weekly-score",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const weeklyData = await weeklyRes.json();

        if (weeklyData.success) {
          setWeeklyScore(weeklyData.weeklyScore);
        }

        const streakRes = await fetch(
          "http://localhost:5000/api/tasks/streak",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const streakData = await streakRes.json();

        if (streakData.success) {
          setStreak(streakData.currentStreak);
        }

      } catch (error) {

        console.error("Metrics load failed");

      }

    };

    fetchMetrics();

  }, []);

  return (

    <div className="grid grid-cols-4 gap-6 mb-10">

      <div className="bg-zinc-800 p-6 rounded-xl">
        <p className="text-zinc-400 text-sm">Daily Score</p>
        <p className="text-3xl font-bold mt-2">{dailyScore}%</p>
      </div>

      <div className="bg-zinc-800 p-6 rounded-xl">
        <p className="text-zinc-400 text-sm">Weekly Score</p>
        <p className="text-3xl font-bold mt-2">{weeklyScore}%</p>
      </div>

      <div className="bg-zinc-800 p-6 rounded-xl">
        <p className="text-zinc-400 text-sm">Current Streak</p>
        <p className="text-3xl font-bold mt-2">{streak} 🔥</p>
      </div>

      <div className="bg-zinc-800 p-6 rounded-xl">
        <p className="text-zinc-400 text-sm">Tasks Today</p>
        <p className="text-3xl font-bold mt-2">{totalTasks}</p>
      </div>

    </div>

  );

};

export default DashboardMetrics;