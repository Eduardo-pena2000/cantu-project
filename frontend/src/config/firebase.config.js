import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_FCM_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_FCM_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_FCM_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_FCM_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

async function messaging() {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
}

export function firebaseMessagingUrl() {
  let url = "/firebase-messaging-sw.js";

  // Append the params
  Object.entries(firebaseConfig).forEach(([key, value], index) => {
    url += `${index === 0 ? "?" : "&"}${key}=${value}`;
  });
  return url;
}

export async function fetchToken() {
  try {
    const fcmMessaging = await messaging();

    if (fcmMessaging) {
      let registration = null;

      if ("serviceWorker" in navigator) {
        registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          registration = await navigator.serviceWorker.register(firebaseMessagingUrl());
        }
      }

      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      return token;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export { app, messaging };
