import axios from "axios";
import { auth } from "./firebaseConfig";

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_SERVER_URL}/api`,
});

const IMPERSONATION_TOKEN_KEY = "impersonationToken";
const IMPERSONATION_ACTOR_USER_KEY = "impersonationActorUser";
const IMPERSONATION_TARGET_USER_KEY = "impersonationTargetUser";
const IMPERSONATION_EXPIRES_AT_KEY = "impersonationExpiresAt";

const clearImpersonationAndRestoreActor = () => {
	const actorUser = localStorage.getItem(IMPERSONATION_ACTOR_USER_KEY);
	if (actorUser) {
		localStorage.setItem("user", actorUser);
	}

	localStorage.removeItem(IMPERSONATION_TOKEN_KEY);
	localStorage.removeItem(IMPERSONATION_ACTOR_USER_KEY);
	localStorage.removeItem(IMPERSONATION_TARGET_USER_KEY);
	localStorage.removeItem(IMPERSONATION_EXPIRES_AT_KEY);
};

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

	const impersonationToken = localStorage.getItem("impersonationToken");
	if (impersonationToken) {
		config.headers["x-impersonation-token"] = impersonationToken;
	}

	if (config.data instanceof FormData) {
		config.headers["Content-Type"] = "multipart/form-data";
	}

	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;
		const code = error?.response?.data?.code;
		const message = (error?.response?.data?.message || "") as string;
		const currentlyImpersonating = Boolean(
			localStorage.getItem(IMPERSONATION_TOKEN_KEY)
		);

		const shouldRestoreAdmin =
			currentlyImpersonating &&
			status === 401 &&
			(code === "IMPERSONATION_EXPIRED" ||
				code === "IMPERSONATION_INACTIVE" ||
				code === "IMPERSONATION_INVALID" ||
				message.toLowerCase().includes("impersonation"));

		if (shouldRestoreAdmin) {
			clearImpersonationAndRestoreActor();
			if (window.location.pathname !== "/admin/users") {
				window.location.href = "/admin/users";
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
