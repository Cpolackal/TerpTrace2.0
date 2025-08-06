const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// In Firebase Functions, this is automatically initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

module.exports = { db };
