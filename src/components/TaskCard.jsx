import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskActions from "./TaskActions";

export default function TaskCard({ task }) {
  const { updateTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  return (
    <div className="todo-item">
      {!editing ? (
        <>
          <span className="todo-title-text">{task.title}</span>
          <TaskActions task={task} onEdit={() => setEditing(true)} />
        </>
      ) : (
        <>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={() => { updateTask(task.id, { title: value }); setEditing(false); }}>
            ✔
          </button>
          <button onClick={() => setEditing(false)}>✕</button>
        </>
      )}
    </div>
  );
}
