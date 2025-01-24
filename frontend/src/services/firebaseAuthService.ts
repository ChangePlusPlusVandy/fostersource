import { auth } from "./firebaseConfig";

export const signIn = async (email: string, password: string) => {
	try {
		const userCredential = await auth.signInWithEmailAndPassword(
			email,
			password
		);
		return userCredential.user;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const register = async (email: string, password: string) => {
	try {
		const userCredential = await auth.createUserWithEmailAndPassword(
			email,
			password
		);
		return userCredential.user;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const signOut = async () => {
	try {
		await auth.signOut();
		console.log("User signed out successfully.");
	} catch (error: any) {
		throw new Error(error.message);
	}
};
