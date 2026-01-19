// File: src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- DÁN MÃ CONFIG CỦA BẠN VÀO ĐÂY ---
const firebaseConfig = {
  apiKey: "AIzaSyAqKzkhlrt-JrufrKWjiCuP2-sZhaPs9-o",
  authDomain: "quan-ly-kp25.firebaseapp.com",
  projectId: "quan-ly-kp25",
  storageBucket: "quan-ly-kp25.firebasestorage.app",
  messagingSenderId: "229778342477",
  appId: "1:229778342477:web:89c9e7f4b6f053c62f9204",
  measurementId: "G-EDE590ZNE2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);