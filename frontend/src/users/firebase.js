// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: "terptrace2.firebaseapp.com",
  projectId: "terptrace2",
  storageBucket: "terptrace2.firebasestorage.app",
  messagingSenderId: "123847594427",
  appId: "1:123847594427:web:a97639ed7e718b4dbcf49e",
  measurementId: "G-V52WG7YCKE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if in browser environment
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

const auth = getAuth(app);

export { auth };
