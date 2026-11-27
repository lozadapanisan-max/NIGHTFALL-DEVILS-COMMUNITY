import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBLmbuGWd9aUPCFBrkPFqGDKwZYvRkHqxQ",
    authDomain: "nightfall-devils-b0d77.firebaseapp.com",
    projectId: "nightfall-devils-b0d77",
    storageBucket: "nightfall-devils-b0d77.firebasestorage.app",
    messagingSenderId: "758952684668",
    appId: "1:758952684668:web:5be641ca90c9d5134f2df9",
    measurementId: "G-R6MZ05M4DR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
