import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZwqZVDZtEwZPqbEJlZBuRtKBOJUVrJWo",
  authDomain: "tgmindmatch.firebaseapp.com",
  projectId: "tgmindmatch",
  storageBucket: "tgmindmatch.appspot.com",
  messagingSenderId: "1095814091947",
  appId: "1:1095814091947:web:d7b9d9c9c9c9c9c9c9c9c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized successfully');

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

console.log('Firestore initialized successfully');
