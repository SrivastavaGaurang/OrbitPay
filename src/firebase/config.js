import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// OrbitPay Live Firebase configuration for project orbitpay-6d05d
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBaCbe8lXkTsn4vs0cRqXR7vCmws61dDvE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "orbitpay-6d05d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "orbitpay-6d05d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "orbitpay-6d05d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "327550133523",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:327550133523:web:15ce22f8da7c2daea766e6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SWN7323E75"
};

// Check if credentials are set
const activeApiKey = firebaseConfig.apiKey;
export const isMockMode = 
  !activeApiKey || 
  activeApiKey === "YOUR_API_KEY" ||
  activeApiKey.includes("placeholder");

let app;
let auth = null;
let db = null;

if (!isMockMode) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 OrbitPay Firebase connected successfully to project orbitpay-6d05d!");
  } catch (error) {
    console.error("⚠️ Failed to initialize real Firebase, switching to Mock Mode:", error);
  }
} else {
  console.log("🌌 Running in Mock Local Storage mode.");
}

export { auth, db };
