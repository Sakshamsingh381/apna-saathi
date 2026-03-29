const TransformationProgress = ({ progress = 0 }) => {

  return (
    <div className="bg-zinc-800 p-6 rounded-xl">

      <h2 className="mb-4 font-semibold">Transformation Progress</h2>

      <div className="w-full bg-zinc-700 h-4 rounded">
        <div
          className="bg-blue-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-sm">{progress}% completed</p>

    </div>
  );
};

export default TransformationProgress;