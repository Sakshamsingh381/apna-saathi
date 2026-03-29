import React from "react";

const Card = ({ title, value, subtitle }) => {
  return (
    <div className="relative bg-zinc-900 p-7 rounded-2xl border border-zinc-800 
                    hover:border-zinc-700 transition duration-300 
                    shadow-lg shadow-black/30">
      
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
                      from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        
        {title && (
          <h3 className="text-xs uppercase tracking-wider text-zinc-500">
            {title}
          </h3>
        )}

        {value && (
          <p className="text-4xl font-bold mt-3 text-white">
            {value}
          </p>
        )}

        {subtitle && (
          <p className="text-sm text-zinc-400 mt-3">
            {subtitle}
          </p>
        )}

      </div>

    </div>
  );
};

export default Card;