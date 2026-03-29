import MoodChart from "./MoodChart";
import PerformanceChart from "./PerformanceChart";

const BehavioralTrendSection = ({ trends = [], moodTrend = [] }) => {

  return (
    <div className="bg-zinc-800 rounded-xl p-6 shadow-md">

      <h2 className="text-lg font-semibold mb-6">
        7-Day Behavioral Trends
      </h2>

      <div className="grid grid-cols-2 gap-6">

        {/* Mood Trend */}
        <div>
          <h3 className="text-sm text-zinc-400 mb-4">
            Mood Trend
          </h3>

          <MoodChart data={moodTrend} />
        </div>

        {/* Performance Trend */}
        <div>
          <h3 className="text-sm text-zinc-400 mb-4">
            Performance Trend
          </h3>

          <PerformanceChart data={trends} />
        </div>

      </div>

    </div>
  );

};

export default BehavioralTrendSection;