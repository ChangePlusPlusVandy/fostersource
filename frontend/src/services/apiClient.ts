import axios from "axios";
import { auth } from "./firebaseConfig";

const apiClient = axios.create({
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
			unsubscribe(); // Stop listening after getting the auth state
		});
	});
}

apiClient.interceptors.request.use(async (config) => {
	const token = await getFirebaseToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	if (config.data instanceof FormData) {
		config.headers["Content-Type"] = "multipart/form-data";
	}

	return config;
});

export default apiClient;
