import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1>Pomodoro Focus</h1>
      <p>Sign in to continue</p>

      <button className="btn btn-primary" onClick={login}>
        Sign in with Google
      </button>
    </div>
  );
}
