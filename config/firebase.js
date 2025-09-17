import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRYWO1fcE4x9fzYB7WiHru6IomMrmpx34",
  authDomain: "kindling-99fa7.firebaseapp.com",
  projectId: "kindling-99fa7",
  storageBucket: "kindling-99fa7.firebasestorage.app",
  messagingSenderId: "73934565193",
  appId: "1:73934565193:web:36e30b25d5e3d1a63e3498",
  measurementId: "G-DB9J1H69C3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Use correct auth initialization based on platform
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // Use standard web auth
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);
export const usersRef = collection(db, 'users');
