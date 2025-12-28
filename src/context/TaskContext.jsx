import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const TaskContext = createContext();

export function TaskProvider({ user, children }) {
  const [tasks, setTasks] = useState([]);

  // 🔹 Firestore sync (READ)
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const ref = collection(db, "users", user.uid, "tasks");
    const unsub = onSnapshot(ref, (snap) => {
      setTasks(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return unsub;
  }, [user]);

  // 🔹 ADD (FIXED)
  const addTask = async (title) => {
    if (!user || !title.trim()) return;

    await addDoc(
      collection(db, "users", user.uid, "tasks"),
      {
        title,
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    );
  };

  // 🔹 UPDATE
  const updateTask = async (id, updates) => {
    if (!user || !id) return;

    await setDoc(
      doc(db, "users", user.uid, "tasks", id),
      { ...updates, updatedAt: Date.now() },
      { merge: true }
    );
  };

  // 🔹 DELETE
  const deleteTask = async (id) => {
    if (!user || !id) return;
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
