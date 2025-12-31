import { useEffect, useRef, useState } from "react";
import { useTasks } from "../context/TaskContext";
import {
  updateTodayAnalytics,
  getTodayAnalytics,
} from "../utils/dailyAnalytics";
import Toast from "./Toast";

const MODES = {
  focus: { label: "Focus", minutes: 25 },
  short: { label: "Short Break", minutes: 5 },
  long: { label: "Long Break", minutes: 15 },
};

export default function FocusTab({ focusMinutes, soundEnabled }) {
  const { tasks, updateTask, focusedTaskId, setFocusedTaskId } = useTasks();

  /* =========================
     STATE
  ========================= */
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [toast, setToast] = useState("");

  // 🔒 CRITICAL: lazy init (runs ONCE)
  const [today, setToday] = useState(() => getTodayAnalytics());

  /* =========================
     REFS
  ========================= */
  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);
  const completedRef = useRef(false);
  const audioRef = useRef(null);

  /* =========================
     INIT SOUND
  ========================= */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notify.mp3");
  }, []);

  /* =========================
     REFRESH TODAY (ONLY ON FOCUS)
  ========================= */
  useEffect(() => {
    const refresh = () => setToday(getTodayAnalytics());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  /* =========================
     RESET TIMER ON MODE CHANGE
  ========================= */
  useEffect(() => {
    const seconds =
      mode === "focus"
        ? focusMinutes * 60
        : MODES[mode].minutes * 60;

    setTimeLeft(seconds);
    setRunning(false);
    completedRef.current = false;
  }, [mode, focusMinutes]);

  /* =========================
     START / PAUSE
  ========================= */
  const startFocus = () => {
    if (!running) {
      const durationMs =
        (mode === "focus"
          ? focusMinutes
          : MODES[mode].minutes) *
        60 *
        1000;

      endTimeRef.current = Date.now() + durationMs;
      completedRef.current = false;

      if (mode === "focus") {
        const active = tasks.find((t) => t.status === "in_progress");
        if (active) setFocusedTaskId(active.id);
      }
    }

    setRunning((r) => !r);
  };

  /* =========================
     TIMER (BACKGROUND SAFE)
  ========================= */
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();

      if (remaining <= 0) {
        if (completedRef.current) return;
        completedRef.current = true;

        clearInterval(intervalRef.current);
        setRunning(false);
        setTimeLeft(0);

        if (soundEnabled && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        // 🔒 SIDE EFFECTS AFTER TIMER
        setTimeout(() => {
          if (mode === "focus") {
            updateTodayAnalytics((a) => {
              a.pomodoros += 1;
              a.focusMinutes += focusMinutes;
            });

            // 🔒 refresh ONCE
            setToday(getTodayAnalytics());

            // 🔒 HARD GUARD
            if (typeof focusedTaskId === "string") {
              updateTask(focusedTaskId, { status: "completed" });
              setFocusedTaskId(null);
            }
          } else {
            updateTodayAnalytics((a) => {
              a.breaks += 1;
            });

            setToday(getTodayAnalytics());
          }

          setToast("Session completed");
        }, 0);

        return;
      }

      setTimeLeft(Math.ceil(remaining / 1000));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  /* =========================
     UI
  ========================= */
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="page">
      <div className="card focus-card">
        {/* Mode Switch */}
        <div className="mode-switch">
          {Object.keys(MODES).map((k) => (
            <button
              key={k}
              className={mode === k ? "active" : ""}
              onClick={() => setMode(k)}
            >
              {MODES[k].label}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="timer">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        {/* Actions */}
        <div className="focus-actions">
          <button className="primary" onClick={startFocus}>
            {running ? "Pause" : "Start"}
          </button>

          <button
            className="secondary"
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

        {/* 🔥 TODAY (INLINE, SAFE) */}
        <div className="today-inline">
          <div className="today-title">🔥 Today</div>
          <div className="today-inline-stats">
            <div>
              <strong>{today.focusMinutes}</strong>
              <span>min</span>
            </div>
            <div>
              <strong>{today.pomodoros}</strong>
              <span>🍅</span>
            </div>
            <div>
              <strong>{today.breaks}</strong>
              <span>☕</span>
            </div>
          </div>
        </div>
      </div>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </section>
  );
}
