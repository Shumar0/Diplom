import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA0chzV4nZDzoPw-qo8a6II4mEgZKNC-YE",
    authDomain: "nexttech-eae93.firebaseapp.com",
    databaseURL: "https://nexttech-eae93-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nexttech-eae93",
    storageBucket: "nexttech-eae93.firebasestorage.app",
    messagingSenderId: "281980275643",
    appId: "1:281980275643:web:05224319aa0df69204129e",
    measurementId: "G-FWN639HEPB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth}