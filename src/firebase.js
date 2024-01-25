// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "block-estate.firebaseapp.com",
  projectId: "block-estate",
  storageBucket: "block-estate.appspot.com",
  messagingSenderId: "955205438298",
  appId: "1:955205438298:web:004817858934ff05050163"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);