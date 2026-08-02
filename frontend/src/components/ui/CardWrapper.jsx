const CardWrapper = ({ children }) => {
  return (
    <div className="
      relative
      overflow-hidden
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      rounded-2xl
      p-5
      shadow-xl shadow-black/30
      transition-all duration-300
      hover:scale-[1.02]
      hover:border-indigo-400/30
    ">

      {/* Subtle Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      {children}

    </div>
  );
};

export default CardWrapper;