import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH4zee9oD2zqIASJvrGeoLtEYjvaMX-4c",
  authDomain: "devcollab-b0efc.firebaseapp.com",
  projectId: "devcollab-b0efc",
  storageBucket: "devcollab-b0efc.firebasestorage.app",
  messagingSenderId: "88831179429",
  appId: "1:88831179429:web:d0b83db00eb0f4bff72b4c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();