import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block w-full px-4 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;

  return (
    <div className="h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">

      {/* Logo Section */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-white">Apna Saathi</h1>
        <p className="text-xs text-zinc-500 mt-1">Behavioral Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/tasks" className={linkClass}>
          Tasks
        </NavLink>

        <NavLink to="/goals" className={linkClass}>
          Goals
        </NavLink>

        <NavLink to="/focus-areas" className={linkClass}>
          Focus Areas
        </NavLink>

        <NavLink to="/transformation" className={linkClass}>
          Transformation
        </NavLink>

        {/* NEW LINK */}
        <NavLink to="/reflection" className={linkClass}>
          Reflection
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </div>

    </div>
  );

};

export default Sidebar;