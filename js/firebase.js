import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuN5dn_PNC37CbiaRaQRx78gds6f-JXbI",
  authDomain: "smallvillagerani.firebaseapp.com",
  projectId: "smallvillagerani",
  storageBucket: "smallvillagerani.firebasestorage.app",
  messagingSenderId: "762742575521",
  appId: "1:762742575521:web:0fbd4b3bd62caafe013be0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
