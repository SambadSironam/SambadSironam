import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4SwOBBfpzJh5z9re63y8utN7DnNvLB0Y",
  authDomain: "sambad-sironam.firebaseapp.com",
  projectId: "sambad-sironam",
  storageBucket: "sambad-sironam.firebasestorage.app",
  messagingSenderId: "380720167533",
  appId: "1:380720167533:web:bded923dfc88b539901d64",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);