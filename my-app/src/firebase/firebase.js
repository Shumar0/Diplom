import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB5YyMfLSFCa1Y1xHc90adtvjNNlOj7Uq4",
    authDomain: "market-4376c.firebaseapp.com",
    databaseURL: "https://market-4376c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "market-4376c",
    storageBucket: "market-4376c.firebasestorage.app",
    messagingSenderId: "768020938990",
    appId: "1:768020938990:web:ce14f0c6b11c959a6333ff",
    measurementId: "G-R8PJP8CLQ6"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth}