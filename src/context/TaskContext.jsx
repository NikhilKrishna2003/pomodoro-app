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
const LOCAL_KEY = "nikhub_tasks";

export function TaskProvider({ user, children }) {
  const [tasks, setTasks] = useState([]);
  const [focusedTaskId, setFocusedTaskId] = useState(null);

  // LOAD TASKS
  useEffect(() => {
    if (!user) {
      const local = localStorage.getItem(LOCAL_KEY);
      setTasks(local ? JSON.parse(local) : []);
      return;
    }

    const ref = collection(db, "users", user.uid, "tasks");
    const unsub = onSnapshot(ref, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [user]);

  // SAVE LOCAL (guest)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // ADD
  const addTask = async (title) => {
    const clean = title.trim();
    if (!clean) return;

    const payload = {
      title: clean,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (!user) {
      setTasks((t) => [{ id: crypto.randomUUID(), ...payload }, ...t]);
      return;
    }

    await addDoc(collection(db, "users", user.uid, "tasks"), payload);
  };

  // UPDATE
  const updateTask = async (id, updates) => {
    const payload = { ...updates, updatedAt: Date.now() };

    if (!user) {
      setTasks((t) =>
        t.map((x) => (x.id === id ? { ...x, ...payload } : x))
      );
      return;
    }

    await setDoc(
      doc(db, "users", user.uid, "tasks", id),
      payload,
      { merge: true }
    );
  };

  // DELETE
  const deleteTask = async (id) => {
    if (!user) {
      setTasks((t) => t.filter((x) => x.id !== id));
      return;
    }

    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        focusedTaskId,
        setFocusedTaskId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return ctx;
}
