const FocusAreaProgress = ({ focusAreas = [] }) => {

  return (

    <div className="bg-zinc-800 rounded-xl p-6 shadow-md">

      <h2 className="text-lg font-semibold mb-6">
        Focus Area Progress
      </h2>

      {focusAreas.length === 0 && (
        <p className="text-zinc-400">
          No focus areas
        </p>
      )}

      <div className="space-y-4">

        {focusAreas.map((area, index) => (

          <div key={index}>

            <div className="flex justify-between mb-1 text-sm">
              <span>{area.name}</span>
              <span>{area.progress}%</span>
            </div>

            <div className="w-full bg-zinc-700 rounded h-2">

              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${area.progress}%` }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default FocusAreaProgress;