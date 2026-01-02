
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";

// Use namespace destructuring to bypass "no exported member" errors
const { initializeApp } = firebaseApp as any;
const { getAuth } = firebaseAuth as any;

// These values would normally come from your Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyBThaaAgMK0SxVdKOqbWpLn8vLcEcsPLys",
  authDomain: "mernai-6de82.firebaseapp.com",
  projectId: "mernai-6de82",
  storageBucket: "mernai-6de82.firebasestorage.app",
  messagingSenderId: "469552958816",
  appId: "1:469552958816:web:fc75b43c7a3927ba5ee205"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
