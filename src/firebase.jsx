// Firebase core
import { initializeApp } from "firebase/app";

// Auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firestore
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqhT7Z4UcSllfHKWxZUkEsWB3_OxATlNI",
  authDomain: "nikhil-pomodoro-app.firebaseapp.com",
  projectId: "nikhil-pomodoro-app",
  storageBucket: "nikhil-pomodoro-app.appspot.com",
  messagingSenderId: "357899045394",
  appId: "1:357899045394:web:25de122bf0638b01b426cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔑 Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ☁️ Firestore
export const db = getFirestore(app);

export default app;
