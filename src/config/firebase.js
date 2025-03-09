const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
require("dotenv").config();

const firebaseConfig = {
    apiKey: "AIzaSyCo12mO1u6yQGTROuZ59nlP465VrZGMYic",
    authDomain: "sample-chatbot-675ad.firebaseapp.com",
    projectId: "sample-chatbot-675ad",
    storageBucket: "sample-chatbot-675ad.firebasestorage.app",
    messagingSenderId: "768458030683",
    appId: "1:768458030683:web:f01f0659c15d89c1cd897e",
    measurementId: "G-RPPF2MED4Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };