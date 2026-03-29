import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Goals = () => {

  const [title, setTitle] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [deadline, setDeadline] = useState("");
  const [requiredTasks, setRequiredTasks] = useState(5); // 🔥 NEW
  const [goals, setGoals] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);

  const token = localStorage.getItem("token");

  // FETCH DATA
  const fetchData = async () => {
    try {

      const [goalRes, focusRes] = await Promise.all([
        fetch("http://localhost:5000/api/goals", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:5000/api/focusareas", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const goalData = await goalRes.json();
      const focusData = await focusRes.json();

      if (goalData.success) setGoals(goalData.goals);
      if (focusData.success) setFocusAreas(focusData.focusAreas);

    } catch (error) {
      console.error("Fetch failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const createGoal = async (e) => {
    e.preventDefault();

    if (!title || !focusArea || !deadline) {
      alert("All fields required");
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/goals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            focusArea,
            deadline,
            requiredTasks   // 🔥 NEW
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        setTitle("");
        setFocusArea("");
        setDeadline("");
        setRequiredTasks(5); // reset
        fetchData();
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Create failed");
    }
  };

  // COMPLETE GOAL 🔥 NEW
  const completeGoal = async (id) => {
    try {

      await fetch(
        `http://localhost:5000/api/goals/complete/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchData();

    } catch (error) {
      console.error("Complete failed");
    }
  };

  // DELETE
  const deleteGoal = async (id) => {
    try {

      if (!window.confirm("Delete this goal?")) return;

      const res = await fetch(
        `http://localhost:5000/api/goals/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchData();
      }

    } catch (error) {
      console.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-xl">

        <h1 className="text-xl font-semibold mb-6">
          Goals
        </h1>

        {/* FORM */}
        <form
          onSubmit={createGoal}
          className="bg-zinc-800 p-6 rounded-xl space-y-4 mb-6"
        >

          {/* Focus Area */}
          <select
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          >
            <option value="">Select Focus Area</option>

            {focusAreas.map(f => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Title */}
          <input
            type="text"
            placeholder="Enter goal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          />

          {/* Deadline */}
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          />

          {/* 🔥 REQUIRED TASKS */}
          <input
            type="number"
            placeholder="Number of tasks required"
            value={requiredTasks}
            onChange={(e) => setRequiredTasks(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          />

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded"
          >
            Create Goal
          </button>

        </form>

        {/* LIST */}
        <div className="space-y-3">

          {goals.map(goal => (
            <div
              key={goal._id}
              className="bg-zinc-800 p-3 rounded flex justify-between items-center"
            >

              <div>
                <p className="font-medium">{goal.title}</p>

                <p className="text-sm text-zinc-400">
                  {goal.focusArea?.name}
                </p>

                <p className="text-xs text-zinc-500">
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>

                {/* 🔥 PROGRESS */}
                <p className="text-xs text-green-400">
                  {goal.progress ?? 0}% completed
                </p>
              </div>

              <div className="flex gap-2">

                {/* 🔥 COMPLETE BUTTON */}
                <button
                  onClick={() => completeGoal(goal._id)}
                  disabled={goal.isCompleted}
                  className={`px-2 py-1 text-xs rounded ${
                    goal.isCompleted
                      ? "bg-gray-500"
                      : "bg-green-600"
                  }`}
                >
                  {goal.isCompleted ? "Done" : "Complete"}
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteGoal(goal._id)}
                  className="text-red-500 text-sm"
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

export default Goals;