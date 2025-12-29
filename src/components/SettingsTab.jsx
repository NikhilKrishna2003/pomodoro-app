import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function SettingsTab({
  user,
  focusMinutes,
  setFocusMinutes,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  onClose,
}) {
  // TEMP STATE (apply on Done)
  const [tempFocus, setTempFocus] = useState(focusMinutes);
  const [tempTheme, setTempTheme] = useState(theme);
  const [tempSound, setTempSound] = useState(soundEnabled);

  const handleDone = () => {
    setFocusMinutes(tempFocus);
    setTheme(tempTheme);
    setSoundEnabled(tempSound);
    onClose();
  };
  console.log("Settings opened");

  return (
    <>

      {/* BACKDROP */}
      <div className="settings-backdrop" onClick={onClose} />

      {/* SIDE PANEL */}
      <aside className="settings-side-panel">
        <header className="settings-header">
          <h2>Settings</h2>
          <button className="icon" onClick={onClose}>✕</button>
        </header>

        {/* PROFILE */}
        <section className="settings-section">
          <h4>Profile</h4>
          <div className="profile-card">
            <div className="avatar">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="profile-name">
                {user?.displayName || "User"}
              </div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>
        </section>

        {/* FOCUS */}
        <section className="settings-section">
          <h4>Focus</h4>
          <label>Focus duration (minutes)</label>
          <input
            type="number"
            min="5"
            max="120"
            value={tempFocus}
            onChange={(e) => setTempFocus(+e.target.value)}
          />
        </section>

        {/* APPEARANCE */}
        <section className="settings-section">
          <h4>Appearance</h4>
          <div className="toggle">
            <button
              className={tempTheme === "dark" ? "active" : ""}
              onClick={() => setTempTheme("dark")}
            >
              Dark
            </button>
            <button
              className={tempTheme === "light" ? "active" : ""}
              onClick={() => setTempTheme("light")}
            >
              Light
            </button>
          </div>
        </section>

        {/* SOUND */}
        <section className="settings-section">
          <h4>Notifications</h4>
          <div className="toggle">
            <button
              className={tempSound ? "active" : ""}
              onClick={() => setTempSound(true)}
            >
              On
            </button>
            <button
              className={!tempSound ? "active" : ""}
              onClick={() => setTempSound(false)}
            >
              Off
            </button>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="settings-actions">
          <button className="danger" onClick={() => signOut(auth)}>
            Logout
          </button>
          <button className="primary" onClick={handleDone}>
            Done
          </button>
        </div>
      </aside>
    </>
  );
}
