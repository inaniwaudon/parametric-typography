import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB5sjJUxBkr6MEP9z_fFELh3uTlEFDvDKc",
  authDomain: "parametric-typography.firebaseapp.com",
  databaseURL:
    "https://parametric-typography-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parametric-typography",
  storageBucket: "parametric-typography.appspot.com",
  messagingSenderId: "773201213917",
  appId: "1:773201213917:web:dd5036c71569392b2a9e34",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
