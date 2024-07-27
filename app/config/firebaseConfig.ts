// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { mainLogger } from "./logger";
import {
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DAATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from './.env';
const fireabaseLogger = mainLogger.extend('Firebase');

fireabaseLogger.info('Firebase initializing...');
fireabaseLogger.info('Firebase API Key:', FIREBASE_API_KEY);
fireabaseLogger.info('Firebase Auth Domain:', FIREBASE_AUTH_DOMAIN);
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DAATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
fireabaseLogger.info('Firebase initialized');

export { database };