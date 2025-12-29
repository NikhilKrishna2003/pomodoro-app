import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function TasksTab() {
  const { tasks, addTask } = useTasks();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const grouped = {
    pending: tasks.filter(t => t.status === "pending"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    completed: tasks.filter(t => t.status === "completed"),
  };

  return (
    <section className="page">
      <div className="card">

        {/* Add Task */}
        <div className="task-add">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you working on?"
          />
          <button
            className="primary"
            onClick={() => {
              if (!input.trim()) return;
              addTask(input.trim());
              setInput("");
            }}
          >
            Add
          </button>
        </div>

        {/* Toggle Tabs */}
        <div className="task-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`task-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="count">{grouped[tab.key].length}</span>
            </button>
          ))}
        </div>

        {/* Active Task List */}
        <div className="task-content">
          {grouped[activeTab].length === 0 ? (
            <p className="empty">No tasks here</p>
          ) : (
            grouped[activeTab].map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>


      </div>
    </section>
  );
}
