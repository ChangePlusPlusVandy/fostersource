import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "AIzaSyCjrihHfWN9_MWR98IpqsFo4LGpd1tOViQ",
	authDomain: "foster-source-ccbd9.firebaseapp.com",
	projectId: "foster-source-ccbd9",
	storageBucket: "foster-source-ccbd9.firebasestorage.app",
	messagingSenderId: "922379251706",
	appId: "1:922379251706:web:9536272907f90c05e53e43",
	measurementId: "G-RCL1YFPQZQ",
};

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export default firebase;
