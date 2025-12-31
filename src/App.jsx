// App.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { TaskProvider } from "./context/TaskContext";
import FocusTab from "./components/FocusTab";
import TasksTab from "./components/TasksTab";
import SettingsTab from "./components/SettingsTab";
import TodayDashboard from "./components/TodayDashboard";
import Login from "./pages/Login";

const SETTINGS_KEY = "nikhub_settings";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("focus");
  const [showSettings, setShowSettings] = useState(false);

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [theme, setTheme] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  /* =========================
     LOAD SETTINGS
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const s = JSON.parse(saved);
      setFocusMinutes(s.focusMinutes ?? 25);
      setTheme(s.theme ?? "dark");
      setSoundEnabled(s.soundEnabled ?? true);
    }
  }, []);

  /* =========================
     SAVE SETTINGS
  ========================= */
  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ focusMinutes, theme, soundEnabled })
    );
  }, [focusMinutes, theme, soundEnabled]);

  /* =========================
     APPLY THEME
  ========================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <TaskProvider user={user}>
      <div className="app-root">
        {/* TOP NAV */}
        <header className="top-nav">
          <div className="brand">NikHub</div>

          <nav className="nav-tabs">
            <button
              className={activeTab === "focus" ? "active" : ""}
              onClick={() => setActiveTab("focus")}
            >
              Focus
            </button>

            <button
              className={activeTab === "tasks" ? "active" : ""}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>

            <button
              className={showSettings ? "active" : ""}
              onClick={() => setShowSettings(true)}
            >
              Settings
            </button>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        {activeTab === "focus" && (
          <FocusTab
            focusMinutes={focusMinutes}
            soundEnabled={soundEnabled}
          />
        )}


        {activeTab === "tasks" && <TasksTab />}
      </div>

      {/* SETTINGS SIDE PANEL */}
      {showSettings && (
        <SettingsTab
          user={user}
          focusMinutes={focusMinutes}
          setFocusMinutes={setFocusMinutes}
          theme={theme}
          setTheme={setTheme}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onClose={() => setShowSettings(false)}
        />
      )}
    </TaskProvider>
  );
}
