import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidV4 } from "uuid";

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
const db = getDatabase(app);

export const postTypography = async (
  ratio0: number,
  ratio1: number,
  ratio2: number
) => {
  const id = uuidV4();
  await set(ref(db, `typos/${id}`), {
    ratio0,
    ratio1,
    ratio2,
    created_at: new Date().toISOString(),
  });
};
