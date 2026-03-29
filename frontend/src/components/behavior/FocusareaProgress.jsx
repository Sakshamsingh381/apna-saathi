import { useEffect, useState } from "react";

const FocusAreaProgress = () => {

  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProgress = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/goals/focus-progress",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result = await res.json();

        if (result.success) {
          setProgressData(result.progress);
        }

      } catch (error) {

        console.error("Failed to load focus progress");

      } finally {

        setLoading(false);

      }

    };

    fetchProgress();

  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-800 rounded-xl p-6 shadow-md">
        <p className="text-zinc-400">Loading focus progress...</p>
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="bg-zinc-800 rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-2">
          Focus Area Progress
        </h2>
        <p className="text-zinc-400">
          No goals found yet.
        </p>
      </div>
    );
  }

  return (

    <div className="bg-zinc-800 rounded-xl p-6 shadow-md">

      <h2 className="text-lg font-semibold mb-6">
        Focus Area Progress
      </h2>

      <div className="space-y-4">

        {progressData.map((item, index) => (

          <div key={index}>

            <div className="flex justify-between mb-1">
              <span className="text-sm">{item.focusArea}</span>
              <span className="text-sm">{item.progress}%</span>
            </div>

            <div className="w-full bg-zinc-700 rounded h-2">

              <div
                className="bg-blue-500 h-2 rounded transition-all duration-500"
                style={{ width: `${item.progress}%` }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default FocusAreaProgress;