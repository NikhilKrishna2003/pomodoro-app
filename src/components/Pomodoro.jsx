import { useState } from "react";
import { TaskProvider } from "../context/TaskContext";
import FocusTab from "./FocusTab";
import TasksTab from "./TasksTab";

export default function Pomodoro({ user }) {
  const [tab, setTab] = useState("focus");

  return (
    <TaskProvider user={user}>
      <div className="app-root">
        <header className="app-header">
          <h1>NikHub</h1>

          <div className="tabs">
            <button
              className={tab === "focus" ? "active" : ""}
              onClick={() => setTab("focus")}
            >
              Focus
            </button>
            <button
              className={tab === "tasks" ? "active" : ""}
              onClick={() => setTab("tasks")}
            >
              Tasks
            </button>
          </div>
        </header>

        <main className="app-content">
          {tab === "focus" && <FocusTab />}
          {tab === "tasks" && <TasksTab />}
        </main>
      </div>
    </TaskProvider>
  );
}
