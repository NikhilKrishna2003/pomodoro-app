import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const TaskContext = createContext();

export function TaskProvider({ user, children }) {
  const [tasks, setTasks] = useState([]);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FIRESTORE LISTENER (SAFE)
  ========================= */
  useEffect(() => {
    // 🔒 HARD GUARD — DO NOT REMOVE
    if (!user?.uid) {
      setTasks([]);
      setFocusedTaskId(null);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setTasks(list);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore tasks listener error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  /* =========================
     ACTIONS (ALL GUARDED)
  ========================= */

  const addTask = async (title) => {
    if (!user?.uid || !title?.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title: title.trim(),
      status: "pending",
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  const updateTask = async (taskId, updates) => {
    // 🔒 ABSOLUTE SAFETY CHECK
    if (typeof taskId !== "string" || !updates) return;

    try {
      await updateDoc(doc(db, "tasks", taskId), updates);
    } catch (err) {
      console.error("updateTask failed:", err);
    }
  };

  const deleteTask = async (taskId) => {
    if (typeof taskId !== "string") return;

    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (err) {
      console.error("deleteTask failed:", err);
    }
  };

  /* =========================
     CONTEXT VALUE
  ========================= */
  const value = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    focusedTaskId,
    setFocusedTaskId,
  };

  return (
    <TaskContext.Provider value={value}>
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
