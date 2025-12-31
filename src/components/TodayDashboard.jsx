import { useEffect, useState } from "react";
import { getTodayAnalytics } from "../utils/dailyAnalytics";

export default function TodayDashboard() {
  const [today, setToday] = useState(getTodayAnalytics());

  useEffect(() => {
    const refresh = () => {
      setToday(getTodayAnalytics());
    };

    // 🔔 listen to analytics updates
    window.addEventListener("nikhub-analytics-updated", refresh);

    // also refresh when app regains focus
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("nikhub-analytics-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
      <div className="card today-widget">

      <h3 style={{ marginBottom: 12 }}>🔥 Today</h3>

      <div className="stats">
        <div className="stat">
          <strong>{today.focusMinutes}</strong>
          <span>Focus Minutes</span>
        </div>

        <div className="stat">
          <strong>{today.pomodoros}</strong>
          <span>Pomodoros</span>
        </div>

        <div className="stat">
          <strong>{today.breaks}</strong>
          <span>Breaks</span>
        </div>
      </div>
    </div>
  );
}
