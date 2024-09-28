import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBdoAf0Al59P_4lP9czRorP-S1D74S7uqI",
  authDomain: "taskify-24593.firebaseapp.com",
  projectId: "taskify-24593",
  storageBucket: "taskify-24593.appspot.com",
  messagingSenderId: "831026867117",
  appId: "1:831026867117:web:9989947fc6d05348744f24",
  measurementId: "G-VV2P1505QB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
