import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApHsJ9VwO3BFxfO3VyhHdB2z307A95gTk",
  authDomain: "hexa-app-2c301.firebaseapp.com",
  projectId: "hexa-app-2c301",
  storageBucket: "hexa-app-2c301.firebasestorage.app",
  messagingSenderId: "527457940585",
  appId: "1:527457940585:web:3feebd166f641482471ef8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
