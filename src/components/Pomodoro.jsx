import { useEffect, useRef, useState } from "react";
import { doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

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

  // 🔊 SOUND
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);

  const completedRef = useRef(false);

  /* ---------- INIT AUDIO ---------- */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notify.mp3");
  }, []);

  /* ---------- THEME ---------- */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ---------- INIT STATS ---------- */
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "stats", "summary");
    setDoc(ref, { pomodoros: 0, focusMinutes: 0 }, { merge: true });
  }, [user]);

  /* ---------- MODE CHANGE ---------- */
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
          if (completedRef.current) return 0;
          completedRef.current = true;

          setRunning(false);

          // 🔔 PLAY SOUND
          if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          if (mode === "focus") {
            setPomodoros((p) => p + 1);
            setFocusTime((t) => t + focusMinutes);

            updateDoc(
              doc(db, "users", user.uid, "stats", "summary"),
              {
                pomodoros: increment(1),
                focusMinutes: increment(focusMinutes),
              }
            );

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
  }, [running, mode, focusMinutes, user, soundEnabled]);

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
              <ListTodo size={20} />
            </button>
            <button className="icon-btn" onClick={() => setOpenSettings(true)}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* TIMER */}
        <div className="timer-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        {/* CONTROLS */}
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={() => setRunning(!running)}
          >
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

      <TodoDrawer
        open={openTodos}
        onClose={() => setOpenTodos(false)}
        user={user}
      />

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
  );
}
