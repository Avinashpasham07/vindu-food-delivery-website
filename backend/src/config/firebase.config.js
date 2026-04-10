const admin = require('firebase-admin');
const path = require('path');

try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Production: Pass the JSON string via environment variable
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // Local: Load from file
        const serviceAccountPath = path.join(__dirname, '../../vindu-7eb49-firebase-adminsdk-fbsvc-90f94d90e0.json');
        serviceAccount = require(serviceAccountPath);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin Initialized Successfully');
} catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error);
}

module.exports = admin;
