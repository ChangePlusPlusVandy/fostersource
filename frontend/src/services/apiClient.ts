import axios from "axios";
import { auth } from "./firebaseConfig";

const apiClient = axios.create({
	baseURL: "http://localhost:5001/api",
	headers: { "Content-Type": "application/json" },
});

async function getFirebaseToken(): Promise<string | null> {
	return new Promise((resolve) => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const token = await user.getIdToken(true);
				console.log("🔥 Sending Firebase Token:", token);
				resolve(token);
			} else {
				console.warn("⚠️ No authenticated user found");
				resolve(null);
			}
			unsubscribe(); // Stop listening after getting the auth state
		});
	});
}

apiClient.interceptors.request.use(async (config) => {
	const token = await getFirebaseToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default apiClient;
