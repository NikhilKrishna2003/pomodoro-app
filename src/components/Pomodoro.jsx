import { useEffect, useRef, useState } from "react";
import { doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

import "./Pomodoro.css";
import Stats from "./Stats";
import TodoDrawer from "./TodoDrawer";
import SettingsModal from "./SettingsModal";
import Toast from "./Toast";
import { ListTodo, Settings } from "lucide-react";
import { TaskProvider } from "../context/TaskContext";

const MODES = {
  focus: { label: "Focus", minutes: 25 },
  short: { label: "Short Break", minutes: 5 },
  long: { label: "Long Break", minutes: 15 },
};

export default function Pomodoro({ user }) {
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [openTodos, setOpenTodos] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [pomodoros, setPomodoros] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [toast, setToast] = useState("");

  const [theme, setTheme] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notify.mp3");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) return;
    setDoc(doc(db, "users", user.uid, "stats", "summary"),
      { pomodoros: 0, focusMinutes: 0 },
      { merge: true }
    );
  }, [user]);

  useEffect(() => {
    setTimeLeft(
      mode === "focus" ? focusMinutes * 60 : MODES[mode].minutes * 60
    );
    setRunning(false);
  }, [mode, focusMinutes]);

  useEffect(() => {
    if (!running) return;

    const i = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (completedRef.current) return 0;
          completedRef.current = true;

          setRunning(false);

          if (soundEnabled) audioRef.current?.play().catch(() => {});

          if (mode === "focus") {
            setPomodoros(p => p + 1);
            setFocusTime(t => t + focusMinutes);

            updateDoc(doc(db, "users", user.uid, "stats", "summary"), {
              pomodoros: increment(1),
              focusMinutes: increment(focusMinutes),
            });

            setToast("✅ Focus completed");
            setMode("short");
          } else {
            setToast("☕ Break done");
            setMode("focus");
          }

          setTimeout(() => (completedRef.current = false), 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(i);
  }, [running, mode, focusMinutes, soundEnabled, user]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <TaskProvider user={user}>
      <div className="pomodoro-container">
        <div className="pomodoro-card">
          <div className="pomodoro-header">
            <div className="mode-switch">
              {Object.keys(MODES).map((k) => (
                <button
                  key={k}
                  className={`mode-btn ${mode === k ? "active" : ""}`}
                  onClick={() => setMode(k)}
                >
                  {MODES[k].label}
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
          theme={theme}
          setTheme={setTheme}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
        <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
      </div>
    </TaskProvider>
  );
}
