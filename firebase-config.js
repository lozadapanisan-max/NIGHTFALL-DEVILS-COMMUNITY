// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo19m_S4LUXkMF8itUBpzgt1nsR24sn98",
  authDomain: "nightfall-devils.firebaseapp.com",
  projectId: "nightfall-devils",
  storageBucket: "nightfall-devils.firebasestorage.app",
  messagingSenderId: "1026752308802",
  appId: "1:1026752308802:web:31931a927aaedbe524afdb",
  measurementId: "G-7CNMDHR6J6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
