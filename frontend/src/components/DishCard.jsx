import { useState } from "react";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

function DishCard({ dish, onToggle }) {
  const [isToggling, setIsToggling] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(dish.dishId);
    } finally {
      // Small delay so the spinner is visible for at least 300ms
      setTimeout(() => setIsToggling(false), 300);
    }
  };

  return (
    <article
      className={`relative bg-dark-surface border rounded-lg overflow-hidden flex flex-col transition-all duration-200 ${
        dish.isPublished
          ? "border-emerald-500/20 hover:border-emerald-500/40"
          : "border-dark-border hover:border-dark-borderHover"
      }`}
    >
      {/* Status badge */}
      <div
        className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
          dish.isPublished
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-slate-500/10 border border-slate-500/20 text-slate-400"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${dish.isPublished ? "bg-emerald-500" : "bg-slate-400"}`}
        />
        {dish.isPublished ? "Published" : "Draft"}
      </div>

      {/* Dish image */}
      <div className="relative w-full h-40 overflow-hidden bg-dark-base border-b border-dark-border">
        {!imgError ? (
          <img
            src={dish.imageUrl}
            alt={dish.dishName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-base">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 to-transparent pointer-events-none" />
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2 className="text-[14px] font-semibold text-slate-100 line-clamp-1">
          {dish.dishName}
        </h2>
        <p className="text-[11px] text-slate-500 font-mono">
          ID: {dish.dishId}
        </p>

        <button
          id={`toggle-btn-${dish.dishId}`}
          className={`mt-4 w-full py-2 px-4 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed ${
            dish.isPublished
              ? "bg-transparent border border-dark-border text-slate-400 hover:border-dark-borderHover hover:text-white"
              : "bg-orange-600 text-white hover:bg-orange-500"
          }`}
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={`${dish.isPublished ? "Unpublish" : "Publish"} ${dish.dishName}`}
        >
          {isToggling ? (
            <FiLoader size={15} className="animate-spin text-current" />
          ) : (
            <>
              {dish.isPublished ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              {dish.isPublished ? "Unpublish" : "Publish"}
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default DishCard;
