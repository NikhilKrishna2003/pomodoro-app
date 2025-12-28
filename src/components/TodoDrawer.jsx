import { useEffect, useState, useRef } from "react";
import "./TodoDrawer.css";

function TodoDrawer({ open, onClose, onTaskSelect, onReminder }) {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [input, setInput] = useState("");
  const [reminder, setReminder] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date().toTimeString().slice(0, 5);

      setTasks((prev) =>
        prev.map((task) => {
          if (
            task.reminder === now &&
            !task.completed &&
            !task.reminded
          ) {
            onReminder(`🔔 Reminder: ${task.title}`);
            return { ...task, reminded: true };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [onReminder]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: input.trim(),
        completed: false,
        reminder: reminder || null,
        reminded: false,
      },
    ]);
    setInput("");
    setReminder("");
  };

  const editTask = (id, oldTitle) => {
    const updated = prompt("Edit task", oldTitle);
    if (!updated || !updated.trim()) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: updated } : t))
    );
  };

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
            placeholder="New task"
          />
          <input
            type="time"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="todo-list">
          {tasks.map((task) => (
            <li key={task.id} className={`todo-row ${task.completed ? "done" : ""}`}>
              <span
                onClick={() =>
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === task.id
                        ? { ...t, completed: !t.completed }
                        : t
                    )
                  )
                }
              >
                {task.title}
              </span>

              <div className="todo-actions">
                {task.reminder && !task.reminded && (
                  <span className="reminder">⏰ {task.reminder}</span>
                )}
                <button onClick={() => onTaskSelect(task.title)}>🎯</button>
                <button onClick={() => editTask(task.id, task.title)}>✏</button>
                <button
                  onClick={() =>
                    setTasks((prev) => prev.filter((t) => t.id !== task.id))
                  }
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoDrawer;
