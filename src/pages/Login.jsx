import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  return (
    <div
      style={{
        bgcolor: "black",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <h1>NikHub</h1>
      <h2>Personal Productive Hub</h2>
      <p>Sign in to below continue</p>

      <button className="btn btn-primary" onClick={login}>
        Sign in with Google
      </button>
    </div>
  );
}
