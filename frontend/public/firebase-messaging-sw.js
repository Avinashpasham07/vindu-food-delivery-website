importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 🔥 TODO: REPLACE THIS WITH YOUR FIREBASE WEB CONFIG FROM CONSOLE
firebase.initializeApp({
  apiKey: "AIzaSyDxVNu-sCJrftNyfMHQ8Ve_BmFCEJX3z2w",
  authDomain: "vindu-7eb49.firebaseapp.com",
  projectId: "vindu-7eb49",
  storageBucket: "vindu-7eb49.firebasestorage.app",
  messagingSenderId: "504528496291",
  appId: "1:504528496291:web:b41de0a33d37701e330116",
  measurementId: "G-H8XV3PH661"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Make sure you have a logo.png in public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
