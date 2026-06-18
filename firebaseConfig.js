// Firebase (modular JS SDK v12) — single source of truth for the app.
//
// Why the JS SDK and not @react-native-firebase?
//   This Expo app uses the *web* Firebase config and runs in Expo Go / managed
//   workflow, so the pure-JS `firebase` package is the correct choice (no native
//   google-services files or dev client required).
//
// Metro (Expo SDK 56) resolves `firebase/auth` to its React Native build on
// ios/android, which is what exposes `getReactNativePersistence`. See the
// Expo guide: https://docs.expo.dev/guides/using-firebase/

import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeEA1SWEfQUixvRnXmrtkI6_Q2QsfsG9Y",
  authDomain: "chat-app-345f7.firebaseapp.com",
  projectId: "chat-app-345f7",
  storageBucket: "chat-app-345f7.firebasestorage.app",
  messagingSenderId: "602656565366",
  appId: "1:602656565366:web:932368c40f847c7ab65757",
};

// Guard against re-initialization during Fast Refresh / multiple imports.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Persist the auth session in AsyncStorage so the user stays logged in across
// app restarts. `initializeAuth` may only run once per app; on a hot reload it
// throws (auth/already-initialized), so we fall back to the existing instance.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
