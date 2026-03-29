import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Tasks = () => {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {

      const today = new Date().toLocaleDateString("en-CA");

      const res = await fetch(
        `http://localhost:5000/api/tasks?date=${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setTasks(data.tasks);
      }

    } catch (error) {
      console.error("Failed to fetch tasks");
    }
  };

  const fetchGoals = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/goals",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setGoals(data.goals);
      }

    } catch (error) {
      console.error("Failed to fetch goals");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchGoals();
  }, []);

  const createTask = async () => {

    if (!title) return;

    try {

      const today = new Date().toLocaleDateString("en-CA");

      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          plannedDate: today,
          goal: goal || null
        })
      });

      setTitle("");
      setGoal("");
      fetchTasks();

    } catch (error) {
      console.error("Task creation failed");
    }

  };

  const completeTask = async (id) => {

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

    fetchTasks();
  };

  const deleteTask = async (id) => {

    try {

      if (!window.confirm("Delete this task?")) return;

      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchTasks();

    } catch (error) {
      console.error("Delete failed");
    }

  };

  return (
    <DashboardLayout>

      <div className="max-w-2xl">

        <h1 className="text-xl font-semibold mb-6">
          Tasks
        </h1>

        <div className="bg-zinc-800 p-4 rounded mb-6 space-y-3">

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          >
            <option value="">No Goal (Optional)</option>

            {goals.map(g => (
              <option key={g._id} value={g._id}>
                {g.title}
              </option>
            ))}
          </select>

          <div className="flex gap-3">

            <input
              className="flex-1 bg-zinc-700 p-3 rounded"
              placeholder="New Task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              onClick={createTask}
              className="bg-blue-600 px-4 rounded"
            >
              Add
            </button>

          </div>

        </div>

        <div className="space-y-3">

          {tasks.length === 0 && (
            <p className="text-zinc-400">No tasks for today</p>
          )}

          {tasks.map(task => (

            <div
              key={task._id}
              className="bg-zinc-800 p-3 rounded flex justify-between items-center"
            >

              <div>

                <p className={task.status === "completed" ? "line-through text-zinc-400" : ""}>
                  {task.title}
                </p>

                {task.goal && (
                  <p className="text-xs text-zinc-400">
                    Goal: {task.goal.title}
                  </p>
                )}

              </div>

              <div className="flex gap-3">

                {task.status !== "completed" && (
                  <button
                    onClick={() => completeTask(task._id)}
                    className="text-green-500"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Tasks;