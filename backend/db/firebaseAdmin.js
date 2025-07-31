import admin from "firebase-admin";
import serviceAccount from "./firebase_service_account.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://terptrace2.firebaseio.com"
  });
}


const db = admin.firestore();
export { admin, db }