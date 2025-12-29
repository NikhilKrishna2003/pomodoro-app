import { useEffect, useRef, useState } from "react";
import { useTasks } from "../context/TaskContext";
import Toast from "./Toast";
import Stats from "./Stats";

const MODES = {
  focus: { label: "Focus", minutes: 25 },
  short: { label: "Short Break", minutes: 5 },
  long: { label: "Long Break", minutes: 15 },
};

export default function FocusTab({ focusMinutes, soundEnabled }) {
  /* 🔹 CONTEXT FIRST (VERY IMPORTANT) */
  const { tasks, updateTask, focusedTaskId, setFocusedTaskId } = useTasks();

  /* 🔹 LOCAL STATE */
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [toast, setToast] = useState("");
  const [pomodoros, setPomodoros] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  /* INIT SOUND */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notify.mp3");
  }, []);

  /* RESET TIMER ON MODE CHANGE */
  useEffect(() => {
    setTimeLeft(
      mode === "focus"
        ? focusMinutes * 60
        : MODES[mode].minutes * 60
    );
    setRunning(false);
  }, [mode, focusMinutes]);

  /* START / PAUSE */
  const startFocus = () => {
    if (!running && mode === "focus") {
      const active = tasks.find(t => t.status === "in_progress");
      if (active) setFocusedTaskId(active.id);
    }
    setRunning(r => !r);
  };

  /* TIMER LOGIC */
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);

          if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          if (mode === "focus") {
            setPomodoros(p => p + 1);
            setTotalMinutes(m => m + focusMinutes);

            if (focusedTaskId) {
              updateTask(focusedTaskId, { status: "completed" });
              setFocusedTaskId(null);
            }
          }

          setToast("Focus session completed");
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, mode, soundEnabled, focusedTaskId, focusMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const focusedTask = tasks.find(t => t.id === focusedTaskId);

  return (
    <section className="page">
      <div className="card focus-card">
        <div className="mode-switch">
          {Object.keys(MODES).map(k => (
            <button
              key={k}
              className={mode === k ? "active" : ""}
              onClick={() => setMode(k)}
            >
              {MODES[k].label}
            </button>
          ))}
        </div>

        <Stats pomodoros={pomodoros} totalMinutes={totalMinutes} />

        {focusedTask && (
          <div style={{ opacity: 0.8 }}>
            Focusing on: <b>{focusedTask.title}</b>
          </div>
        )}

        <div className="timer">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <div className="focus-actions">
          <button className="primary" onClick={startFocus}>
            {running ? "Pause" : "Start"}
          </button>

          <button
            className="secondary"
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
      </div>

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </section>
  );
}
