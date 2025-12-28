import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { auth } from "./firebase";
import Pomodoro from "./components/Pomodoro";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route
          path="/login"
          element={user ? <Navigate to="/app" /> : <Login />}
        />

        {/* Protected app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <Pomodoro user={user} />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={user ? "/app" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
