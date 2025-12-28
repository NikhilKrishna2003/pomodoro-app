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
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="settings-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (same style as Todo) */}
        <div className="drawer-header">
          <h3>Settings</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Focus duration */}
          <div className="settings-item">
            <label>Focus duration</label>
            <div className="settings-input">
              <input
                type="number"
                min="5"
                max="120"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(+e.target.value)}
              />
              <span>minutes</span>
            </div>
          </div>

          {/* Theme toggle */}
          <div className="settings-item">
            <label>Theme</label>
            <div className="theme-toggle-pill">
              <button
                className={`theme-btn ${
                  theme === "dark" ? "active" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                🌙 Dark
              </button>

              <button
                className={`theme-btn ${
                  theme === "light" ? "active" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                ☀️ Light
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button className="settings-save" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
