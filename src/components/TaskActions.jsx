import { useTasks } from "../context/TaskContext";

export default function TaskActions({ task, onEdit }) {
  const { updateTask, deleteTask } = useTasks();

  return (
    <div className="task-actions">
      {task.status === "pending" && (
        <button
          className="icon"
          onClick={() =>
            updateTask(task.id, { status: "in_progress" })
          }
        >
          ▶
        </button>
      )}

      {task.status === "in_progress" && (
        <button
          className="icon"
          onClick={() =>
            updateTask(task.id, { status: "completed" })
          }
        >
          ✔
        </button>
      )}

      {task.status === "completed" && (
        <button
          className="icon"
          onClick={() =>
            updateTask(task.id, { status: "pending" })
          }
        >
          ↺
        </button>
      )}

      <button className="icon" onClick={onEdit}>
        ✏
      </button>

      <button
        className="icon danger"
        onClick={() => {
          if (confirm("Delete this task?")) {
            deleteTask(task.id);
          }
        }}
      >
        🗑
      </button>
    </div>
  );
}
