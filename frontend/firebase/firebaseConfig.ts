import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBGqnlj6jZvr69SA_IKJhh8HprSlwDYTlo",
  authDomain: "foster-source.firebaseapp.com",
  projectId: "foster-source",
  storageBucket: "foster-source.appspot.com",
  messagingSenderId: "417942148543",
  appId: "1:417942148543:web:0b12d7d4bb0823d0623d0a",
  measurementId: "G-18XPBENMJT",
};

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export default firebase;
