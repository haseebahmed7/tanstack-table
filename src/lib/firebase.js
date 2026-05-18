// 1. Zaroori services ko import karein
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Database ke liye
import { getAuth } from "firebase/auth"; // Login ke liye
import { getStorage } from "firebase/storage"; // Images/Files ke liye

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Next.js ke liye check: Agar app pehle se initialized hai to purani use karo, warna nayi banao
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Services ko initialize karke export karein
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
