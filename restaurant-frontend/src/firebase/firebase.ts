// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI8A6yY72Kcgdj60Tky4BRqkbx60OWTQM",
  authDomain: "beefbeef-5f8e7.firebaseapp.com",
  projectId: "beefbeef-5f8e7",
  storageBucket: "beefbeef-5f8e7.firebasestorage.app",
  messagingSenderId: "1056266780997",
  appId: "1:1056266780997:web:cde9482e98947b5f3b7e2c",
  measurementId: "G-16XCV5JZCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export { app as firebaseApp, messaging, onMessage, getToken };
