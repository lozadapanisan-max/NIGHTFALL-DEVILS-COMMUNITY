import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";


const firebaseConfig = {

    apiKey:
        "AIzaSySyBMluGWd9aUPCFBrkPFqGDKwZYvRkHqxQ",

    authDomain:
        "nightfall-devils-b0d77.firebaseapp.com",

    projectId:
        "nightfall-devils-b0d77",

    storageBucket:
        "nightfall-devils-b0d77.firebasestorage.app",

    messagingSenderId:
        "758952684668",

    appId:
        "1:758952684668:web:b641ca90c9d5134f2df9",

    measurementId:
        "G-R6MZ05M4DR"

};


const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(
        app
    );


const db =
    getFirestore(
        app
    );


const storage =
    getStorage(
        app
    );


export {
    app,
    auth,
    db,
    storage
};
