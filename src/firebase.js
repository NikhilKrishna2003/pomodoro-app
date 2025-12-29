import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* -----------------------------
   Firebase config (Vite safe)
------------------------------ */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* -----------------------------
   Initialize Firebase
------------------------------ */
const app = initializeApp(firebaseConfig);

/* -----------------------------
   Auth (persistent)
------------------------------ */
export const auth = getAuth(app);

/* 🔒 Persist login across reloads */
setPersistence(auth, browserLocalPersistence).catch(() => {
  // silent fail (safe for SSR / edge cases)
});

/* Providers */
export const googleProvider = new GoogleAuthProvider();

/* -----------------------------
   Firestore
------------------------------ */
export const db = getFirestore(app);

export default app;
