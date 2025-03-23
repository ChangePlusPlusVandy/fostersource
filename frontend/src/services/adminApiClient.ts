import axios from "axios";
import { auth } from "./firebaseConfig";

const adminApiClient = axios.create({
	baseURL: "http://localhost:5001/api",
});

async function getFirebaseToken(): Promise<string | null> {
	return new Promise((resolve) => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const token = await user.getIdToken(true);
				resolve(token);
			} else {
				console.warn("⚠️ No authenticated user found");
				resolve(null);
			}
			unsubscribe();
		});
	});
}

async function isUserAdmin(): Promise<boolean> {
	try {
		const token = await getFirebaseToken();
		if (!token) return false;

		const res = await axios.get("http://localhost:5001/api/users/is-admin", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data.isAdmin;
	} catch (err) {
		console.error("Failed to check admin status", err);
		return false;
	}
}

adminApiClient.interceptors.request.use(async (config) => {
	const token = await getFirebaseToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	const isAdmin = await isUserAdmin();
	if (!isAdmin) {
		return Promise.reject({ message: "User is not an admin" });
	}

	return config;
});

export default adminApiClient;
