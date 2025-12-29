export default function Stats({ pomodoros, focusMinutes }) {
  return (
    <div className="stats">
      <div className="stat-box">
        <div className="stat-value">{pomodoros}</div>
        <div className="stat-label">Pomodoros</div>
      </div>

      <div className="stat-box">
        <div className="stat-value">{focusMinutes}</div>
        <div className="stat-label">Minutes Focused</div>
      </div>
    </div>
  );
}
