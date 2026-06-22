import { useCallback, useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { io } from "socket.io-client";
import ConnectionStatus from "./components/ConnectionStatus.jsx";
import DishCard from "./components/DishCard.jsx";
import Header from "./components/Header.jsx";

const API_BASE = "http://localhost:4000/api";
const SOCKET_URL = "http://localhost:4000";

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all' | 'published' | 'draft'
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null);

  // Fetch all dishes from the backend
  const fetchDishes = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/dishes`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      setError("Failed to load dishes. Is the backend running?");
      console.error("[fetchDishes]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle isPublished for a dish
  const handleToggle = useCallback(async (dishId) => {
    try {
      const res = await fetch(`${API_BASE}/dishes/${dishId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();

      // Optimistic update — Socket.IO will also confirm the change
      setDishes((prev) =>
        prev.map((d) => (d.dishId === updated.dishId ? updated : d)),
      );

      showNotification(
        `"${updated.dishName}" updated to ${updated.isPublished ? "Published" : "Draft"}`,
        updated.isPublished ? "success" : "warning",
      );
    } catch (err) {
      console.error("[handleToggle]", err);
      showNotification("Failed to update dish. Please try again.", "error");
    }
  }, []);

  // Handler for real-time Socket.IO updates from backend
  const handleSocketUpdate = useCallback((updatedDish) => {
    setDishes((prev) => {
      const exists = prev.find((d) => d.dishId === updatedDish.dishId);
      if (!exists) return prev;
      return prev.map((d) =>
        d.dishId === updatedDish.dishId ? updatedDish : d,
      );
    });
    showNotification(
      `Real-time sync: "${updatedDish.dishName}" changed to ${updatedDish.isPublished ? "Published" : "Draft"}`,
      "info",
    );
  }, []);

  // Show a toast notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Initialize Socket.IO
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("dish:updated", handleSocketUpdate);

    return () => socket.disconnect();
  }, [handleSocketUpdate]);

  // Load dishes on mount
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Filtered dishes
  const filteredDishes = dishes.filter((d) => {
    if (filter === "published") return d.isPublished;
    if (filter === "draft") return !d.isPublished;
    return true;
  });

  const publishedCount = dishes.filter((d) => d.isPublished).length;

  return (
    <div className="flex flex-col min-h-screen bg-dark-base text-slate-100">
      <Header totalDishes={dishes.length} publishedCount={publishedCount} />

      {/* Real-time status indicator */}
      <div className="max-w-6xl w-full mx-auto my-6 px-4 md:px-8 xl:px-0 flex items-center justify-between gap-4 flex-wrap">
        <ConnectionStatus isConnected={isConnected} />

        {/* Filter tabs */}
        <div
          className="flex gap-1 border-b border-dark-border pb-[2px]"
          role="tablist"
        >
          {["all", "published", "draft"].map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`filter-tab-${tab}`}
              aria-selected={filter === tab}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition-all duration-150 whitespace-nowrap ${
                filter === tab
                  ? "border-orange-600 text-slate-100"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="text-[10px] bg-dark-surface border border-dark-border rounded px-1.5 py-0.5 font-semibold ml-1">
                {tab === "all"
                  ? dishes.length
                  : tab === "published"
                    ? publishedCount
                    : dishes.length - publishedCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 xl:px-0">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 min-h-[300px] text-slate-400">
            <FiLoader size={32} className="animate-spin text-orange-600" />
            <p className="text-sm">Loading dishes...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 p-8 border border-red-500/20 bg-red-500/5 rounded-lg text-red-400 text-center max-w-sm mx-auto my-10">
            <FiAlertCircle size={32} className="text-red-500" />
            <p className="text-sm">{error}</p>
            <button
              className="mt-2 px-4 py-1.5 border border-red-500 rounded-md text-xs font-medium hover:bg-red-500/5 transition-all duration-150"
              onClick={fetchDishes}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredDishes.length === 0 && (
          <div className="flex items-center justify-center min-h-[200px] text-slate-500 text-xs">
            <p>No dishes found in this category.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.dishId} dish={dish} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </main>

      {/* Toast notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-md text-xs font-medium max-w-xs border shadow-lg transition-all duration-200 ${
            notification.type === "success"
              ? "border-emerald-500/30 bg-dark-surface text-emerald-400"
              : notification.type === "error"
                ? "border-red-500/30 bg-dark-surface text-red-400"
                : "border-dark-border bg-dark-surface text-slate-200"
          }`}
          role="alert"
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
