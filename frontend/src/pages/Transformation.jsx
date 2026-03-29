import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Transformation = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [transformation, setTransformation] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ================= GET CURRENT TRANSFORMATION =================
  const fetchTransformation = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transformation/current", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setTransformation(data.transformation);
      }

    } catch (err) {
      console.error("Fetch transformation error");
    }
  };

  useEffect(() => {
    fetchTransformation();
  }, []);

  // ================= CREATE =================
  const createTransformation = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/transformation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed");
        setLoading(false);
        return;
      }

      setTitle("");
      setDescription("");

      await fetchTransformation();

      setLoading(false);

      alert("Transformation Created");

    } catch (error) {
      console.error("Transformation creation failed");
      setLoading(false);
    }
  };

  // ================= ACTIVATE =================
  const activateTransformation = async () => {
    try {

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/transformation/activate", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        await fetchTransformation();
        alert("Transformation Activated");
      }

      setLoading(false);

    } catch (err) {
      console.error("Activation failed");
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-semibold mb-6">
        Transformation
      </h1>

      {/* ================= CREATE FORM ================= */}
      {!transformation && (
        <form
          onSubmit={createTransformation}
          className="bg-zinc-800 p-6 rounded-xl space-y-4 max-w-xl"
        >

          <input
            type="text"
            placeholder="Transformation title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700 text-white"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded bg-zinc-700 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 px-4 py-2 rounded text-white"
          >
            {loading ? "Creating..." : "Create Transformation"}
          </button>

        </form>
      )}

      {/* ================= SHOW EXISTING ================= */}
      {transformation && (
        <div className="bg-zinc-800 p-6 rounded-xl max-w-xl space-y-4">

          <h2 className="text-xl text-white">
            {transformation.title}
          </h2>

          <p className="text-zinc-400">
            {transformation.description}
          </p>

          <p className="text-sm text-zinc-500">
            Status: {transformation.status}
          </p>

          {/* 🔥 ACTIVATE BUTTON */}
          {transformation.status === "draft" && (
            <button
              onClick={activateTransformation}
              disabled={loading}
              className="bg-blue-600 px-4 py-2 rounded text-white"
            >
              {loading ? "Activating..." : "Activate Transformation"}
            </button>
          )}

          {/* ✅ ACTIVE STATE */}
          {transformation.status === "active" && (
            <p className="text-green-400 font-medium">
              Transformation Active
            </p>
          )}

        </div>
      )}

    </DashboardLayout>
  );
};

export default Transformation;