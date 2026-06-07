import firebase from "firebase-admin";
import { cert } from "firebase-admin/app";

import { envs } from "./envs.config";

let app: firebase.app.App | any = {
  messaging: () => ({
    sendEachForMulticast: async () => {
      console.log("[MOCK] Sending push notification via mock Firebase");
      return { successCount: 1, failureCount: 0 };
    }
  })
};

if (envs.FIREBASE_PROJECT_ID && envs.FIREBASE_PROJECT_ID !== "dummy") {
  const firebaseConfig = {
    projectId: envs.FIREBASE_PROJECT_ID,
    privateKey: envs.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: envs.FIREBASE_CLIENT_EMAIL,
  };

  app = firebase.initializeApp({
    credential: cert(firebaseConfig),
  });
}

export const firebaseApp = app;