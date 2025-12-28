import { useTasks } from "../context/TaskContext";

export default function TaskActions({ task, onEdit }) {
  const { updateTask, deleteTask } = useTasks();

  return (
    <div className="todo-actions">
      {task.status === "pending" && (
        <button onClick={() => updateTask(task.id, { status: "in_progress" })}>
          ▶
        </button>
      )}

      {task.status === "in_progress" && (
        <button onClick={() => updateTask(task.id, { status: "completed" })}>
          ✔
        </button>
      )}

      <button onClick={onEdit}>✏</button>
      <button onClick={() => deleteTask(task.id)}>🗑</button>
    </div>
  );
}
