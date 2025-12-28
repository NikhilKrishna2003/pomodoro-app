import "./Stats.css";

function Stats({ pomodoros, focusMinutes }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <span className="stat-value">{pomodoros}</span>
        <span className="stat-label">Pomodoros</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{focusMinutes}</span>
        <span className="stat-label">Minutes Focused</span>
      </div>
    </div>
  );
}

export default Stats;
