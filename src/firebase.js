// Import the required Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLcFZasdkDtWNULOryjcu1HZGJyQivz4s",
  authDomain: "hexcode-235c6.firebaseapp.com",
  databaseURL: "https://hexcode-235c6-default-rtdb.firebaseio.com/", // Add Realtime Database URL
  projectId: "hexcode-235c6",
  storageBucket: "hexcode-235c6.appspot.com", // Fix incorrect storageBucket URL
  messagingSenderId: "1040077402956",
  appId: "1:1040077402956:web:afb43834a93e0f22e7d5e9",
  measurementId: "G-QPXH35L144"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app); // Export Realtime Database

export default app;
