import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function useTaskSync(tasks, setTasks, user) {
  // Load Firestore
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "tasks");
    const unsub = onSnapshot(ref, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [user]);

  // Save Firestore
  useEffect(() => {
    if (!user) return;

    tasks.forEach(task => {
      setDoc(doc(db, "users", user.uid, "tasks", task.id), task);
    });
  }, [tasks, user]);
}
