import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env.js";

let firebaseApp;

function firebaseCredentialsConfigured() {
  return Boolean(env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey);
}

export function getFirebaseApp() {
  if (!firebaseApp) {
    try {
      const credential = firebaseCredentialsConfigured()
        ? cert({ projectId: env.firebaseProjectId, clientEmail: env.firebaseClientEmail, privateKey: env.firebasePrivateKey })
        : applicationDefault();
      firebaseApp = getApps()[0] || initializeApp({
        credential,
        projectId: env.firebaseProjectId || undefined,
      });
    } catch (error) {
      const configurationError = new Error("Firebase Admin credentials are not configured");
      configurationError.status = 503;
      configurationError.cause = error;
      throw configurationError;
    }
  }
  return firebaseApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
