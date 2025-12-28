import { useEffect, useRef, useState } from "react";
import "./Pomodoro.css";
import Stats from "./Stats";
import TodoDrawer from "./TodoDrawer";
import SettingsModal from "./SettingsModal";
import Toast from "./Toast";
import { ListTodo, Settings } from "lucide-react";

const MODES = {
  focus: { label: "Focus", minutes: 25 },
  short: { label: "Short Break", minutes: 5 },
  long: { label: "Long Break", minutes: 15 },
};

export default function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [openTodos, setOpenTodos] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [pomodoros, setPomodoros] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [toast, setToast] = useState("");

  const completedRef = useRef(false);

  useEffect(() => {
    setTimeLeft(
      mode === "focus"
        ? focusMinutes * 60
        : MODES[mode].minutes * 60
    );
    setRunning(false);
  }, [mode, focusMinutes]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (completedRef.current) return 0;
          completedRef.current = true;

          setRunning(false);

          if (mode === "focus") {
            setPomodoros((p) => p + 1);
            setFocusTime((t) => t + focusMinutes);
            setToast("✅ Focus session completed");
            setMode("short");
          } else {
            setToast("☕ Break completed");
            setMode("focus");
          }

          setTimeout(() => {
            completedRef.current = false;
          }, 1000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode, focusMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-card">
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
              <ListTodo size={20} />
            </button>
            <button className="icon-btn" onClick={() => setOpenSettings(true)}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="timer-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() =>
              setTimeLeft(
                mode === "focus"
                  ? focusMinutes * 60
                  : MODES[mode].minutes * 60
              )
            }
          >
            Reset
          </button>
        </div>

        <Stats pomodoros={pomodoros} focusMinutes={focusTime} />
      </div>

      <TodoDrawer open={openTodos} onClose={() => setOpenTodos(false)} />
      <SettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
        focusMinutes={focusMinutes}
        setFocusMinutes={setFocusMinutes}
      />
      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
