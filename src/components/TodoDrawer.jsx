import { useEffect, useState } from "react";
import "./TodoDrawer.css";
import { Trash2, Pencil } from "lucide-react";

export default function TodoDrawer({ open, onClose }) {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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
            placeholder="Add a task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (!input.trim()) return;
              setTasks([...tasks, { id: Date.now(), title: input }]);
              setInput("");
            }}
          >
            Add
          </button>
        </div>

        <ul className="todo-list">
          {tasks.map((task) => (
            <li className="todo-item" key={task.id}>
              <span className="todo-title-text">{task.title}</span>
              <div className="todo-actions">
                <button
                  onClick={() =>
                    setTasks(
                      tasks.map((t) =>
                        t.id === task.id
                          ? { ...t, title: prompt("Edit task", t.title) }
                          : t
                      )
                    )
                  }
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() =>
                    setTasks(tasks.filter((t) => t.id !== task.id))
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
