import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import FocusAreas from "./pages/FocusAreas";
import Transformation from "./pages/Transformation";
import Reflection from "./pages/Reflection";

// 🔐 SIMPLE PROTECT WRAPPER (NO BREAKAGE)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Login />;
};

const App = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= MAIN ================= */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <PrivateRoute>
            <Goals />
          </PrivateRoute>
        }
      />

      {/* ✅ MAIN ROUTE (unchanged) */}
      <Route
        path="/focusareas"
        element={
          <PrivateRoute>
            <FocusAreas />
          </PrivateRoute>
        }
      />

      {/* 🔥 BACKUP ROUTE (auto-redirect, no break) */}
      <Route
        path="/focus-areas"
        element={<Navigate to="/focusareas" replace />}
      />

      <Route
        path="/transformation"
        element={
          <PrivateRoute>
            <Transformation />
          </PrivateRoute>
        }
      />

      <Route
        path="/reflection"
        element={
          <PrivateRoute>
            <Reflection />
          </PrivateRoute>
        }
      />

    </Routes>
  );
};

export default App;