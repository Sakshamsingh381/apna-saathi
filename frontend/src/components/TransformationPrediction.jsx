const TransformationPrediction = ({ prediction }) => {

  if (!prediction) {
    return (
      <div className="bg-zinc-800 rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-6">
          Transformation Prediction
        </h2>
        <p className="text-zinc-400">
          No prediction available
        </p>
      </div>
    );
  }

  const {
    status,
    daysLeft,
    completionDate,
    suggestion
  } = prediction;

  const statusColor =
    status === "Strong Momentum"
      ? "text-green-400"
      : status === "On Track"
      ? "text-blue-400"
      : "text-zinc-300";

  return (
    <div className="bg-zinc-800 rounded-xl p-6 shadow-md">

      <h2 className="text-lg font-semibold mb-6">
        Transformation Prediction
      </h2>

      <div className="space-y-5 text-sm">

        {/* STATUS */}
        <div>
          <p className={`font-semibold text-xl ${statusColor}`}>
            {status}
          </p>
          <p className="text-xs text-zinc-500">
            Based on last 7 days performance
          </p>
        </div>

        {/* DAYS + DATE */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-zinc-400 text-xs">Days Left</p>
            <p className="text-white font-semibold text-base">
              {daysLeft}
            </p>
          </div>

          <div>
            <p className="text-zinc-400 text-xs">Completion</p>
            <p className="text-white font-semibold text-base">
              {completionDate
                ? new Date(completionDate).toDateString()
                : "N/A"}
            </p>
          </div>

        </div>

        {/* WARNING */}
        {daysLeft > 60 && (
          <p className="text-red-400 text-xs">
            ⚠ Increase your pace
          </p>
        )}

        {/* SUGGESTION */}
        <div className="bg-zinc-700/40 p-3 rounded-lg">
          <p className="text-zinc-300 text-sm">
            {suggestion}
          </p>
        </div>

      </div>

    </div>
  );
};

export default TransformationPrediction;