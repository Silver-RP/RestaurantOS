// public/firebase-messaging-sw.js
if (typeof self !== 'undefined' && typeof importScripts === 'function') {
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
}

self.firebase.initializeApp({
  apiKey: "AIzaSyCI8A6yY72Kcgdj60Tky4BRqkbx60OWTQM",
  authDomain: "beefbeef-5f8e7.firebaseapp.com",
  projectId: "beefbeef-5f8e7",
  storageBucket: "beefbeef-5f8e7.firebasestorage.app",
  messagingSenderId: "1056266780997",
  appId: "1:1056266780997:web:cde9482e98947b5f3b7e2c",
  measurementId: "G-16XCV5JZCY"
});

const messaging = self.firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
