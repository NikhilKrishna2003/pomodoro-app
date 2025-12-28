import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskList from "./TaskList";

export default function TodoDrawer({ open, onClose }) {
  const { addTask } = useTasks();
  const [input, setInput] = useState("");

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="todo-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Tasks</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="todo-add">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task"
          />
          <button onClick={() => { addTask(input); setInput(""); }}>
            Add
          </button>
        </div>

        <TaskList />
      </div>
    </div>
  );
}
