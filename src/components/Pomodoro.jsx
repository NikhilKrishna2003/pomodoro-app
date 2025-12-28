import { useEffect, useState } from "react";
import "./Pomodoro.css";
import Stats from "./Stats";
import TodoDrawer from "./TodoDrawer";
import SettingsModal from "./SettingsModal";
import Toast from "./Toast";

const MODES = {
  focus: { label: "Focus", minutes: 25 },
  short: { label: "Short Break", minutes: 5 },
  long: { label: "Long Break", minutes: 15 },
};

function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);

  const [openTodos, setOpenTodos] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [activeTask, setActiveTask] = useState(
    localStorage.getItem("activeTask") || ""
  );

  const [pomodoros, setPomodoros] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [toast, setToast] = useState("");

  const [theme, setTheme] = useState("dark");

  /* ---------- THEME ---------- */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ---------- ACTIVE TASK ---------- */
  useEffect(() => {
    localStorage.setItem("activeTask", activeTask);
  }, [activeTask]);

  /* ---------- MODE / FOCUS CHANGE ---------- */
  useEffect(() => {
    setTimeLeft(
      mode === "focus"
        ? focusMinutes * 60
        : MODES[mode].minutes * 60
    );
    setRunning(false);
  }, [mode, focusMinutes]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);

          if (mode === "focus") {
            setPomodoros((p) => p + 1);
            setFocusTime((t) => t + focusMinutes);
            setSessionCount((c) => c + 1);
            setToast("✅ Focus session completed");

            if ((sessionCount + 1) % 4 === 0) {
              setMode("long");
            } else {
              setMode("short");
            }
          } else {
            setToast("☕ Break completed");
            setMode("focus");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode, sessionCount, focusMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-card">
        {/* HEADER */}
        <div className="pomodoro-header">
          <div className="mode-switch">
            {Object.keys(MODES).map((key) => (
              <button
                key={key}
                className={`mode-btn ${mode === key ? "active" : ""}`}
                onClick={() => setMode(key)}
              >
                {MODES[key].label}
              </button>
            ))}
          </div>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setOpenTodos(true)}>
              📝
            </button>
            <button className="icon-btn" onClick={() => setOpenSettings(true)}>
              ⚙️
            </button>
          </div>
        </div>

        {activeTask && <div className="active-task">🎯 {activeTask}</div>}

        <div className="timer-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setRunning(false);
              setTimeLeft(
                mode === "focus"
                  ? focusMinutes * 60
                  : MODES[mode].minutes * 60
              );
            }}
          >
            Reset
          </button>
        </div>

        <Stats pomodoros={pomodoros} focusMinutes={focusTime} />
      </div>

      <TodoDrawer
        open={openTodos}
        onClose={() => setOpenTodos(false)}
        onTaskSelect={setActiveTask}
        onReminder={(msg) => setToast(msg)}
      />

      <SettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
        focusMinutes={focusMinutes}
        setFocusMinutes={setFocusMinutes}
        theme={theme}
        setTheme={setTheme}
      />

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}

export default Pomodoro;
