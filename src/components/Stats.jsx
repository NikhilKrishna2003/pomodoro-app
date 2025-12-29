export default function Stats({ pomodoros, totalMinutes }) {
  return (
    <div className="stats">
      {/* Pomodoros */}
      <div className="stat">
        <strong>{pomodoros}</strong>
        <span>Pomodoros</span>
      </div>

      {/* Total Minutes (emphasis) */}
      <div className="stat total">
        <strong>{totalMinutes}</strong>
        <span>Total Minutes</span>
      </div>
    </div>
  );
}
