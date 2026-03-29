import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        
        <Topbar />

        <main className="flex-1 bg-zinc-950 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;