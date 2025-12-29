import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

export default function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>NikHub</h1>
        <p>Focus. Tasks. Flow.</p>

        <button
          className="primary"
          onClick={() => signInWithPopup(auth, provider)}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

