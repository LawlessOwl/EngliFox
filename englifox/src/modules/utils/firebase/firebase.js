// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbXyF2lS8PEv38WNnmyUtw7QKQY3IwzqM",
  authDomain: "englifox.firebaseapp.com",
  projectId: "englifox",
  databaseURL: "https://englifox-default-rtdb.firebaseio.com/",
  storageBucket: "englifox.firebasestorage.app",
  messagingSenderId: "470065586903",
  appId: "1:470065586903:web:672faf300daf70889fc692",
  measurementId: "G-TMGETS6BR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, auth, database, analytics }