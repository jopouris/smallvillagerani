import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 🔐 Παίρνει το κλειδί από το Secret
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// 🔹 Αρχικοποίηση Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function updateDatabase() {
  const ref = db.collection("deployLogs");
  const data = {
    timestamp: new Date(),
    message: "Νέο commit έγινε push στο GitHub 🚀"
  };
  await ref.add(data);
  console.log("✅ Η βάση ενημερώθηκε επιτυχώς!");
}

updateDatabase().catch(console.error);
