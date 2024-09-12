import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjzLSAXNP9l-2v1YmwbZmoESTbmZzPenA",
  authDomain: "lab1-5094c.firebaseapp.com",
  projectId: "lab1-5094c",
  storageBucket: "lab1-5094c.appspot.com",
  messagingSenderId: "717237593142",
  appId: "1:717237593142:web:e6089fc3dbba1adad96497",
  measurementId: "G-WNHKVVRX9Z"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };