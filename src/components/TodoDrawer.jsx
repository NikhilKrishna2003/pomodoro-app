import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export default function TodoDrawer({ user, open, onClose }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!user || !open) return;

    const q = query(
      collection(db, "users", user.uid, "todos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, [user, open]);

  const addTodo = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(db, "users", user.uid, "todos"), {
      text: input,
      completed: false,
      createdAt: Date.now(),
    });

    setInput("");
  };

  const toggleTodo = async (id, completed) => {
    await updateDoc(
      doc(db, "users", user.uid, "todos", id),
      { completed: !completed }
    );
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "todos", id));
  };

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="todo-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Todos</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {!user && <p>Please login to use todos</p>}

        {user && (
          <>
            <div className="todo-add">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a task"
              />
              <button onClick={addTodo}>Add</button>
            </div>

            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                <span
                  className="todo-title-text"
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                >
                  {todo.text}
                </span>

                  <div className="todo-actions">
                    <button onClick={() => deleteTodo(todo.id)}>🗑</button>
                  </div>
                </li>

              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
