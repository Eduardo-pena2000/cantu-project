import firebase from "firebase-admin";
import { cert } from "firebase-admin/app";

import { envs } from "./envs.config";

const firebaseConfig = {
  projectId: envs.FIREBASE_PROJECT_ID,
  privateKey: envs.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: envs.FIREBASE_CLIENT_EMAIL,
};

export const firebaseApp = firebase.initializeApp({
  credential: cert(firebaseConfig),
});