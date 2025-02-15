import { auth } from "./firebaseConfig";
import {
	sendPasswordResetEmail as resetEmail,
	confirmPasswordReset as confirm,
} from "firebase/auth";

const getErrorMessage = (errorCode: string): string => {
	switch (errorCode) {
		case "auth/invalid-email":
			return "Invalid email address. Please check and try again.";
		case "auth/user-disabled":
			return "This account has been disabled. Please contact support.";
		case "auth/user-not-found":
			return "No account found with this email. Please sign up.";
		case "auth/wrong-password":
			return "Incorrect password. Please try again.";
		case "auth/email-already-in-use":
			return "This email is already in use. Please use a different email.";
		case "auth/weak-password":
			return "Password is too weak. Please choose a stronger password.";
		case "auth/operation-not-allowed":
			return "This operation is not allowed. Please contact support.";
		default:
			return "An unexpected error occurred. Please try again.";
	}
};

export const signIn = async (email: string, password: string) => {
	try {
		const userCredential = await auth.signInWithEmailAndPassword(
			email,
			password
		);
		const idToken = await userCredential.user?.getIdToken();
		return idToken;
	} catch (error: any) {
		const errorCode = error.code;
		throw new Error(getErrorMessage(errorCode));
	}
};

export const register = async (email: string, password: string) => {
	try {
		const userCredential = await auth.createUserWithEmailAndPassword(
			email,
			password
		);
		const idToken = await userCredential.user?.getIdToken();
		return idToken;
	} catch (error: any) {
		const errorCode = error.code;
		throw new Error(getErrorMessage(errorCode));
	}
};

export const signOut = async () => {
	try {
		await auth.signOut();
	} catch (error: any) {
		throw new Error("An error occurred while signing out. Please try again.");
	}
};

export const sendPasswordResetEmail = async (email: string) => {
	try {
		await resetEmail(auth, email, {
			url: "http://localhost:3000/reset-password",
			handleCodeInApp: true,
		});
	} catch (error: any) {
		const errorCode = error.code;
		throw new Error(getErrorMessage(errorCode));
	}
};

export const confirmPasswordReset = async (
	code: string,
	newPassword: string
) => {
	try {
		await confirm(auth, code, newPassword);
	} catch (error: any) {
		const errorCode = error.code;
		throw new Error(getErrorMessage(errorCode));
	}
};
