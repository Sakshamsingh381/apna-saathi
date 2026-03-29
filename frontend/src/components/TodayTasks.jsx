const TodayTasks = ({ tasks = [] }) => {

  const completeTask = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: "completed"
      })
    });

    window.location.reload();
  };

  const deleteTask = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    window.location.reload();
  };

  return (

    <div className="bg-zinc-800 rounded-xl p-6 shadow-md">

      <h2 className="text-lg font-semibold mb-6">
        Today's Tasks
      </h2>

      <div className="space-y-3">

        {tasks.length === 0 && (
          <div className="text-zinc-500">
            No tasks planned for today
          </div>
        )}

        {tasks.map((task) => (

          <div
            key={task._id}
            className="flex justify-between items-center bg-zinc-700 p-3 rounded"
          >

            <span className={task.status === "completed" ? "line-through text-zinc-400" : ""}>
              {task.title}
            </span>

            <div className="flex gap-3">

              {task.status !== "completed" && (
                <button
                  onClick={() => completeTask(task._id)}
                  className="text-green-400 text-sm"
                >
                  Complete
                </button>
              )}

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-400 text-sm"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default TodayTasks;