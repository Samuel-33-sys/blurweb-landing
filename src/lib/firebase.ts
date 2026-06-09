/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromCache, getDocFromServer } from "firebase/firestore";

// These values will be populated by the user in the Secrets panel
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key-to-prevent-rendering-crash",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn("WARNING: VITE_FIREBASE_API_KEY is not defined. The application is running using dummy fallback configurations. Firebase authentication and database features will fail until real environment variables are configured.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Test connection to Firestore
async function testConnection() {
  try {
    // We try to fetch a dummy doc to verify connection
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    console.log("Firestore connection successful");
  } catch (error: any) {
    if (error.message?.includes('client is offline')) {
      console.error("Firestore connection failed: Client is offline. Check your Firebase config.");
    } else if (error.code === 'permission-denied') {
      console.warn("Firestore connection test: Permission denied (expected if rules are strict).");
    } else {
      console.error("Firestore connection error:", error);
    }
  }
}

if (import.meta.env.DEV) {
  testConnection();
}
