import { getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./config";
import type { AuthGateway, AuthUser } from "./contracts";

function toAuthUser(user: { uid: string; email: string | null; displayName: string | null }): AuthUser {
  return { uid: user.uid, email: user.email, displayName: user.displayName };
}

export function createFirebaseAuthGateway(): AuthGateway | null {
  if (!isFirebaseConfigured) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  return {
    currentUser: () => auth.currentUser ? toAuthUser(auth.currentUser) : null,
    signInWithGoogle: async () => {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      return toAuthUser(result.user);
    },
    signOut: () => signOut(auth),
    subscribe: (listener) => onAuthStateChanged(auth, (user) => listener(user ? toAuthUser(user) : null)),
    getIdToken: async () => auth.currentUser?.getIdToken() || null,
  };
}

