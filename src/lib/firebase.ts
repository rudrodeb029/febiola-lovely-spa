import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "spa-usa",
  appId: "1:546780697472:web:4deef452342540f1ada765",
  databaseURL: "https://spa-usa-default-rtdb.firebaseio.com",
  storageBucket: "spa-usa.firebasestorage.app",
  apiKey: "AIzaSyAwPvmLGgmHWBctqT5kR3F5UfQ0GdNYEyE",
  authDomain: "spa-usa.firebaseapp.com",
  messagingSenderId: "546780697472",
  projectNumber: "546780697472",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
