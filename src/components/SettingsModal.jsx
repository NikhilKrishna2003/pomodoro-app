export default function SettingsModal({
  isOpen,
  onClose,
  focusMinutes,
  setFocusMinutes,
  theme,
  setTheme,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="setting-item">
          <label>Focus duration (minutes)</label>
          <input
            type="number"
            min="5"
            max="120"
            value={focusMinutes}
            onChange={(e) => setFocusMinutes(+e.target.value)}
          />
        </div>

        <div className="setting-item">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
