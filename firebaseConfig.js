// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeJ2FD-nUJVlATCzXpkXs2akc3ZrsDtYo",
  authDomain: "apppedidos-18bd4.firebaseapp.com",
  projectId: "apppedidos-18bd4",
  storageBucket: "apppedidos-18bd4.firebasestorage.app",
  messagingSenderId: "894876699466",
  appId: "1:894876699466:web:d8d14eb240061105280fb3",
  measurementId: "G-73HRCSLM10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Only initialize Analytics in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;