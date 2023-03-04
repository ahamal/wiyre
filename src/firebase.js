// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaH0oJR3A1oLIy-0D9rxTRROCturloMjE",
  authDomain: "wiyre-app.firebaseapp.com",
  projectId: "wiyre-app",
  storageBucket: "wiyre-app.appspot.com",
  messagingSenderId: "472433777221",
  appId: "1:472433777221:web:28028efbcef4b24700e12c",
  measurementId: "G-HVXJDS6K6B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
const analytics = getAnalytics(app);
