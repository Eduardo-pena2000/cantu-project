importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js");

// Get the URL params sent through the service worker registration
const params = new URL(location).searchParams;

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
  measurementId: params.get("measurementId"),
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // payload.fcmOptions?.link comes from our backend API route handle
  // payload.data?.link comes from the Firebase Console where link is the "key"
  const link = payload.fcmOptions?.link ?? payload.data?.link;

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./globe.svg",
    data: { url: link },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // This checks if the client is already open and if it is, it focuses on the tab. If it is not open,
  // it opens a new tab with the URL passed in the notification payload
  event.waitUntil(
    // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      const url = event.notification.data.url;

      if (!url) return;

      // If relative URL is passed in firebase console or API route handler, it may open a new window
      // as the client. url is the full URL i.e. https://example.com/ and the url is /about whereas
      // if we passed in the full URL. it will focus on the existing tab i.e. https://example.com/about
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
