// v9 compat packages are API compatible with v8 code
// using compat solved this error export 'default' (imported as 'firebase') was not found in 'firebase/app'
import { env } from 'react-dotenv';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/messaging';
import 'firebase/storage';
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

// Initialize Performance Monitoring and get a reference to the service
const perf = getPerformance(app);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export default firebase;
export const messaging = firebase.messaging();

