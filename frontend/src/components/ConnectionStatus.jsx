function ConnectionStatus({ isConnected }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-all duration-200 ${
        isConnected
          ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
          : "border-amber-500/20 text-amber-500 bg-amber-500/5"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`}
      />
      {isConnected ? "Live" : "Reconnecting..."}
    </div>
  );
}

export default ConnectionStatus;
