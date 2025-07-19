// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_EU4boc112wNlcaQK2nuFK5NezLyCPaM",
  authDomain: "cognisync-b7a39.firebaseapp.com",
  projectId: "cognisync-b7a39",
  storageBucket: "cognisync-b7a39.firebasestorage.app",
  messagingSenderId: "35280693357",
  appId: "1:35280693357:web:a61a256c94144ef34c3764",
  measurementId: "G-2CJQ9JVRYQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

