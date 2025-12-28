export default function SettingsModal({
  isOpen,
  onClose,
  focusMinutes,
  setFocusMinutes,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <label>Focus duration (minutes)</label>
        <input
          type="number"
          min="5"
          max="120"
          value={focusMinutes}
          onChange={(e) => setFocusMinutes(+e.target.value)}
        />

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
