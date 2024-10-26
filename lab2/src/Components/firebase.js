import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmc9xsDMCqqFjoLufwGq0S78pBwloThuo",
  authDomain: "ratillalab2-cea72.firebaseapp.com",
  projectId: "ratillalab2-cea72",
  storageBucket: "ratillalab2-cea72.appspot.com",
  messagingSenderId: "1042246553340",
  appId: "1:1042246553340:web:b2b0c5595c135e76161179",
  measurementId: "G-R411QSYQL5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };