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
        "AIzaSyAo19m_S4LUXkMF8itUBpzgt1nsR24sn98",

    authDomain:
        "nightfall-devils.firebaseapp.com",

    projectId:
        "nightfall-devils",

    storageBucket:
        "nightfall-devils.firebasestorage.app",

    messagingSenderId:
        "1026752308802",

    appId:
        "1:1026752308802:web:31931a927aaedbe524afdb",

    measurementId:
        "G-7CNMDHR6J6"

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
