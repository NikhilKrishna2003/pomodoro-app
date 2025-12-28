import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const TaskContext = createContext();

export function TaskProvider({ user, children }) {
  const [tasks, setTasks] = useState([]);

  // 🔹 Firestore sync
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const ref = collection(db, "users", user.uid, "tasks");
    const unsub = onSnapshot(ref, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [user]);

  const addTask = async (title) => {
    if (!user || !title.trim()) return;

    const task = {
      title,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(
      doc(collection(db, "users", user.uid, "tasks")),
      task
    );
  };

  const updateTask = async (id, updates) => {
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid, "tasks", id),
      { ...updates, updatedAt: Date.now() },
      { merge: true }
    );
  };

  const deleteTask = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
