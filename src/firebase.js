// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLcFZasdkDtWNULOryjcu1HZGJyQivz4s",
  authDomain: "hexcode-235c6.firebaseapp.com",
  projectId: "hexcode-235c6",
  storageBucket: "hexcode-235c6.firebasestorage.app",
  messagingSenderId: "1040077402956",
  appId: "1:1040077402956:web:afb43834a93e0f22e7d5e9",
  measurementId: "G-QPXH35L144"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;