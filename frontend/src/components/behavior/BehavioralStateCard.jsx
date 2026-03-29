import React from "react";

const BehavioralStateCard = ({
  state = "Stable Improving",
  burnoutRisk = "Low",
  emotionalTrend = "Slight Upward",
  recoveryStatus = "Active"
}) => {
  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg shadow-black/30">
      
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        
        <h2 className="text-sm uppercase tracking-wider text-zinc-500 mb-4">
          Current Behavioral State
        </h2>

        <h3 className="text-3xl font-semibold text-white mb-6">
          {state}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

          <div>
            <p className="text-zinc-500">Burnout Risk</p>
            <p className="text-white mt-1">{burnoutRisk}</p>
          </div>

          <div>
            <p className="text-zinc-500">Emotional Trend</p>
            <p className="text-white mt-1">{emotionalTrend}</p>
          </div>

          <div>
            <p className="text-zinc-500">Recovery Status</p>
            <p className="text-white mt-1">{recoveryStatus}</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BehavioralStateCard;