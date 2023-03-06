// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC97SS5DKLkmHTmA8g0CFWbhWqenKCYR6I",
    authDomain: "assm-main-react.firebaseapp.com",
    projectId: "assm-main-react",
    storageBucket: "assm-main-react.appspot.com",
    messagingSenderId: "1029084637934",
    appId: "1:1029084637934:web:01aa25a3a4781c1cfae1ff",
    measurementId: "G-NQGYPHNGXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);