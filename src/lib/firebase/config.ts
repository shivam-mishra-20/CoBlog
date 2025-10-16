// Firebase configuration
// Add your Firebase config here from Firebase Console

import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase (avoid multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
