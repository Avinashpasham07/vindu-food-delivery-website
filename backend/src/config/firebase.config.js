const admin = require('firebase-admin');
const path = require('path');

// Path to the service account key provided by the user
const serviceAccountPath = path.join(__dirname, '../../vindu-7eb49-firebase-adminsdk-fbsvc-90f94d90e0.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
    });
    console.log('✅ Firebase Admin Initialized Successfully');
} catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error);
}

module.exports = admin;
