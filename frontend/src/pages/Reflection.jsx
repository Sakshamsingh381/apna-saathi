import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Reflection = () => {

  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");

  // 🔥 FETCH TODAY
  useEffect(() => {

    const fetchToday = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/reflections/today",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (data.success && data.reflection) {
          setMood(data.reflection.mood);
          setEnergy(data.reflection.energy);
          setNotes(data.reflection.notes || "");
        }

      } catch (error) {
        console.error("Fetch today failed");
      }

    };

    fetchToday();

  }, []);

  // 🔥 SAVE
  const handleSave = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/reflections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            mood,
            energy,
            notes
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message);
      }

    } catch (error) {
      console.error("Save failed");
    }

  };

  return (
    <DashboardLayout>

      <div className="max-w-xl">

        <h1 className="text-xl font-semibold mb-6">
          Daily Reflection
        </h1>

        <div className="bg-zinc-800 p-6 rounded-xl space-y-6">

          {/* Mood */}
          <div>
            <p>Mood (1-10)</p>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full"
            />
            <p>Current mood: {mood}</p>
          </div>

          {/* Energy */}
          <div>
            <p>Energy (1-10)</p>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full"
            />
            <p>Current energy: {energy}</p>
          </div>

          {/* Notes */}
          <div>
            <p>Notes</p>
            <textarea
              placeholder="How was your day?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded bg-zinc-700"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Save Reflection
          </button>

        </div>

      </div>

    </DashboardLayout>
  );

};

export default Reflection;