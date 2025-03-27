// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCj1Yw0MCoJfHMuCn2x4MwlJoIqADd7xsw",
    authDomain: "exam-bank-cef0f.firebaseapp.com",
    databaseURL: "https://exam-bank-cef0f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "exam-bank-cef0f",
    storageBucket: "exam-bank-cef0f.firebasestorage.app",
    messagingSenderId: "157632060867",
    appId: "1:157632060867:web:e2aa3ae6f499c0aaa97176",
    measurementId: "G-E40HTPTEXT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export default app;