"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "@/src/lib/firebase/config";

// Initialize with the web app config when one is available (local .env or App Hosting),
// otherwise fall back to automatic initialization:
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments
export const firebaseApp = firebaseConfig ? initializeApp(firebaseConfig) : initializeApp();

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
