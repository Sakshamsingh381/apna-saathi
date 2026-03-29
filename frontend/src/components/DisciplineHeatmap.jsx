import { useEffect, useState } from "react";

const DisciplineHeatmap = () => {

  const [data, setData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weeklyScore, setWeeklyScore] = useState(0);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");

        // Heatmap
        const heatmapRes = await fetch(
          "http://localhost:5000/api/heatmap",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const heatmapData = await heatmapRes.json();

        if (heatmapData.success) {
          setData(heatmapData.heatmap);
        }

        // Streak
        const streakRes = await fetch(
          "http://localhost:5000/api/tasks/streak",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const streakData = await streakRes.json();

        if (streakData.success) {
          setStreak(streakData.currentStreak);
        }

        // Weekly score
        const scoreRes = await fetch(
          "http://localhost:5000/api/tasks/weekly-score",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const scoreData = await scoreRes.json();

        if (scoreData.success) {
          setWeeklyScore(scoreData.weeklyScore);
        }

      } catch (error) {

        console.error("Failed to load discipline data");

      }

    };

    fetchData();

  }, []);

  return (

    <div className="bg-zinc-800 rounded-xl p-6 shadow-md">

      <h2 className="text-lg font-semibold mb-6">
        Weekly Discipline
      </h2>

      <div className="grid grid-cols-7 gap-6 text-center">

        {data.map((day, index) => (

          <div key={index}>

            <div className="text-xs text-zinc-400 mb-2">
              {day.day}
            </div>

            <div
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg ${
                day.count > 0
                  ? "bg-green-500"
                  : "bg-zinc-700"
              }`}
            >
              {day.count > 0 ? "✓" : "–"}
            </div>

          </div>

        ))}

      </div>

      {/* Analytics */}
      <div className="flex justify-between mt-8">

        <div>

          <div className="text-zinc-400 text-xs">
            Current Streak
          </div>

          <div className="text-lg font-semibold">
            🔥 {streak} days
          </div>

        </div>

        <div>

          <div className="text-zinc-400 text-xs">
            Weekly Score
          </div>

          <div className="text-lg font-semibold">
            {weeklyScore}%
          </div>

        </div>

      </div>

    </div>

  );

};

export default DisciplineHeatmap;