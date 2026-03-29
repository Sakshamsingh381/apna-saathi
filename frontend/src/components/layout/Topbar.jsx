import React from "react";

const Topbar = () => {
  return (
    <div className="h-20 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-8">
      
      {/* Left Section */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Dashboard
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Overview of your productivity and psychological patterns
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-zinc-400">
          Welcome back
        </div>
        <div className="h-9 w-9 rounded-full bg-zinc-700"></div>
      </div>
    </div>
  );
};

export default Topbar;