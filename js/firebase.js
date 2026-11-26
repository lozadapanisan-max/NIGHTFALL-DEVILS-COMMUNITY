// ==========================================
// NIGHTFALL DEVILS
// Firebase Initialization
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import firebaseConfig from "../firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export services
export {
  app,
  db,
  auth
};

console.log("🔥 NIGHTFALL DEVILS Firebase initialized successfully.");
