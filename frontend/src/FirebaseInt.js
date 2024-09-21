import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCL9oXp9DSpxAXPkqd9Qq12rAaaKfBtY14",
    databaseURL: "https://chatbot-6d4e5-default-rtdb.firebaseio.com/",
    projectId: "chatbot-6d4e5",
    storageBucket: "chatbot-6d4e5.appspot.com",
    messagingSenderId: "188474058727",
    appId: "1:188474058727:web:42cd5bd433950604867f42",
    measurementId: "G-XRLV6P4ZJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export db as a named export
export { db };
