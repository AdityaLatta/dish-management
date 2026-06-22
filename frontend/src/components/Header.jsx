import { FiCheckCircle, FiFileText, FiGrid } from "react-icons/fi";

function Header({ totalDishes, publishedCount }) {
  return (
    <header className="sticky top-0 z-50 bg-dark-surface border-b border-dark-border px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Dish Manager
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-base border border-dark-border rounded-md"
            title="Total Dishes"
          >
            <FiGrid size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-white">
              {totalDishes}
            </span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-base border border-dark-border rounded-md"
            title="Published Dishes"
          >
            <FiCheckCircle size={15} className="text-emerald-500" />
            <span className="text-sm font-semibold text-white">
              {publishedCount}
            </span>
            <span className="text-xs text-slate-400">Published</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-base border border-dark-border rounded-md"
            title="Draft Dishes"
          >
            <FiFileText size={15} className="text-slate-500" />
            <span className="text-sm font-semibold text-white">
              {totalDishes - publishedCount}
            </span>
            <span className="text-xs text-slate-400">Draft</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
