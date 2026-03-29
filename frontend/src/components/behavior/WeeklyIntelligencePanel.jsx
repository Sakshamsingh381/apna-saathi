const WeeklyIntelligencePanel = ({
  classification,
  moodAverage,
  performanceAverage,
  weeklyScore   // ✅ NEW PROP
}) => {
  return (
    <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-lg shadow-black/30">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">

        <h3 className="text-lg font-semibold text-white mb-6">
          Weekly Intelligence Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <p className="text-sm text-zinc-400">Overall State</p>
            <p className="text-xl font-semibold mt-2 text-white">
              {classification}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">Mood Average</p>
            <p className="text-xl font-semibold mt-2 text-white">
              {moodAverage}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">Performance Average</p>
            <p className="text-xl font-semibold mt-2 text-white">
              {performanceAverage}
            </p>
          </div>

          {/* ✅ NEW BLOCK */}
          <div>
            <p className="text-sm text-zinc-400">Weekly Score</p>
            <p className="text-xl font-semibold mt-2 text-white">
              {weeklyScore}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WeeklyIntelligencePanel;