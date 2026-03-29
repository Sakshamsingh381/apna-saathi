console.log("focusarea file is loaded")

import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

const FocusAreas = () => {

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [requiredGoals, setRequiredGoals] = useState(1);
  const [areas, setAreas] = useState([]);
  const [transformation, setTransformation] = useState(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {

      const tRes = await fetch(
        "http://localhost:5000/api/transformation/current",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const tData = await tRes.json();

      if (!tData.success || !tData.transformation) {
        setTransformation(null);
        setAreas([]);
        return;
      }

      setTransformation(tData.transformation);

      const fRes = await fetch(
        "http://localhost:5000/api/focusareas",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const fData = await fRes.json();

      if (fData.success) {
        setAreas(fData.focusAreas);
      }

    } catch (error) {
      console.error("Fetch failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 CREATE
  const createArea = async (e) => {
    e.preventDefault();

    if (!name || !weight) {
      alert("Fill all fields");
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/focusareas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            weight: Number(weight),
            completionRule: "goal_count",
            requiredCompletedGoals: Number(requiredGoals)
          })
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setName("");
      setWeight("");
      setRequiredGoals(1);

      fetchData();

    } catch (error) {
      console.error("Create failed");
    }
  };

  // 🔥 COMPLETE
  const completeArea = async (id) => {
    try {

      await fetch(
        `http://localhost:5000/api/focusareas/complete/${id}`,
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

  // 🔥 DELETE
  const deleteArea = async (id) => {
    try {

      if (!window.confirm("Delete this focus area?")) return;

      const res = await fetch(
        `http://localhost:5000/api/focusareas/${id}`,
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
          Focus Areas
        </h1>

        {transformation && (
          <div className="bg-zinc-800 p-4 rounded mb-6">
            <p className="text-sm text-zinc-400">
              Current Transformation
            </p>
            <h2 className="text-lg font-semibold">
              {transformation.title}
            </h2>
          </div>
        )}

        {/* 🔥 FORM */}
        <form
          onSubmit={createArea}
          className="bg-zinc-800 p-6 rounded-xl space-y-4 mb-6"
        >

          <input
            type="text"
            placeholder="Focus Area name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          />

          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          />

          {/* 🔥 NEW FIELD */}
          <input
            type="number"
            placeholder="Goals required to complete"
            value={requiredGoals}
            onChange={(e) => setRequiredGoals(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700"
          />

          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded"
          >
            Create Focus Area
          </button>

        </form>

        {/* 🔥 LIST */}
        <div className="space-y-3">

          {areas.length === 0 && (
            <p className="text-zinc-400">
              No focus areas yet
            </p>
          )}

          {areas.map(area => (
            <div
              key={area._id}
              className="bg-zinc-800 p-3 rounded flex justify-between items-center"
            >

              <div>
                <span>{area.name}</span>

                <p className="text-xs text-green-400">
                  {area.isCompleted ? "Completed" : "Active"}
                </p>

                <p className="text-xs text-zinc-400">
                  Needs {area.requiredCompletedGoals} goals
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="text-zinc-400">
                  {area.weight}
                </span>

                <button
                  onClick={() => completeArea(area._id)}
                  disabled={area.isCompleted}
                  className={`text-xs px-2 py-1 rounded ${
                    area.isCompleted
                      ? "bg-gray-500"
                      : "bg-purple-600"
                  }`}
                >
                  {area.isCompleted ? "Done" : "Complete"}
                </button>

                <button
                  onClick={() => deleteArea(area._id)}
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

export default FocusAreas;