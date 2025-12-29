import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskActions from "./TaskActions";

export default function TaskCard({ task }) {
  const { updateTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  return (
    <div className="task-card">
      {!editing ? (
        <>
          <div className="task-main">
            <span className={task.status === "completed" ? "done" : ""}>
              {task.title}
            </span>
            <span className={`badge ${task.status}`} />
          </div>
          <TaskActions task={task} onEdit={() => setEditing(true)} />
        </>
      ) : (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="primary"
            onClick={() => {
              updateTask(task.id, { title: value.trim() });
              setEditing(false);
            }}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
}
