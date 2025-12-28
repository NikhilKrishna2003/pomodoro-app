import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Auth({ user }) {
  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div style={{ marginBottom: "12px", textAlign: "center" }}>
        <span style={{ marginRight: "8px" }}>
          {user.displayName}
        </span>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "12px", textAlign: "center" }}>
      <button className="btn btn-primary" onClick={login}>
        Sign in with Google
      </button>
    </div>
  );
}
