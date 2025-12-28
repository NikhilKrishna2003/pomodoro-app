import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const { tasks } = useTasks();

  const active = tasks.filter(t => t.status !== "completed");
  const done = tasks.filter(t => t.status === "completed");

  return (
    <>
      {active.map(t => <TaskCard key={t.id} task={t} />)}

      {done.length > 0 && <h4>Completed</h4>}
      {done.map(t => <TaskCard key={t.id} task={t} />)}
    </>
  );
}
