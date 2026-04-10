import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

// 🔥 TODO: REPLACE THIS WITH YOUR FIREBASE WEB CONFIG FROM CONSOLE
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (userId, role) => {
  try {
    console.log("🔔 Notification Service: Initializing for", role, userId);
    const permission = await Notification.requestPermission();
    console.log("🔔 Permission Status:", permission);

    if (permission === "granted") {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey || vapidKey === "YOUR_VAPID_KEY") {
        console.error("❌ ERROR: VITE_FIREBASE_VAPID_KEY is missing in .env!");
        return;
      }

      const currentToken = await getToken(messaging, { vapidKey });

      if (currentToken) {
        console.log("✅ FCM Token Generated:", currentToken);
        // Save to backend
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://vindu-food-delivery.onrender.com/api';
        await axios.post(`${apiBase}/auth/update-fcm-token`, {
          userId,
          role,
          token: currentToken
        });
        console.log("🚀 Token synced with backend.");
      } else {
        console.log("⚠️ No registration token available. Request permission to generate one.");
      }
    }
  } catch (err) {
    console.error("❌ An error occurred while retrieving token:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default messaging;
