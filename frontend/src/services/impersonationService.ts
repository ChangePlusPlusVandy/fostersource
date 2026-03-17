import apiClient from "./apiClient";

const IMPERSONATION_TOKEN_KEY = "impersonationToken";
const IMPERSONATION_ACTOR_USER_KEY = "impersonationActorUser";
const IMPERSONATION_TARGET_USER_KEY = "impersonationTargetUser";
const IMPERSONATION_EXPIRES_AT_KEY = "impersonationExpiresAt";

const normalizeUserForStorage = (user: any) => {
	if (!user) return user;
	const normalized = { ...user };
	if (typeof normalized.cart === "string" && normalized.cart !== "") {
		try {
			normalized.cart = JSON.parse(normalized.cart);
		} catch {
			normalized.cart = [];
		}
	}
	return normalized;
};

const startImpersonation = async (
	targetUserId: string,
	reason = "Admin support"
) => {
	const response = await apiClient.post(`/users/${targetUserId}/impersonate`, {
		reason,
	});

	const { impersonationToken, expiresAt, targetUser } = response.data;
	if (!impersonationToken) {
		throw new Error("No impersonation token returned");
	}

	const currentUser = localStorage.getItem("user");
	if (currentUser) {
		localStorage.setItem(IMPERSONATION_ACTOR_USER_KEY, currentUser);
	}

	localStorage.setItem(IMPERSONATION_TOKEN_KEY, impersonationToken);
	localStorage.setItem(IMPERSONATION_EXPIRES_AT_KEY, String(expiresAt));

	if (targetUser) {
		const normalizedTargetUser = normalizeUserForStorage(targetUser);
		localStorage.setItem("user", JSON.stringify(normalizedTargetUser));
		localStorage.setItem(
			IMPERSONATION_TARGET_USER_KEY,
			JSON.stringify(normalizedTargetUser)
		);
	}

	return response.data;
};

const stopImpersonation = async () => {
	await apiClient.post("/users/impersonation/stop");

	const actorUser = localStorage.getItem(IMPERSONATION_ACTOR_USER_KEY);
	if (actorUser) {
		localStorage.setItem("user", actorUser);
	}

	localStorage.removeItem(IMPERSONATION_TOKEN_KEY);
	localStorage.removeItem(IMPERSONATION_ACTOR_USER_KEY);
	localStorage.removeItem(IMPERSONATION_TARGET_USER_KEY);
	localStorage.removeItem(IMPERSONATION_EXPIRES_AT_KEY);
};

const clearImpersonationLocally = () => {
	const actorUser = localStorage.getItem(IMPERSONATION_ACTOR_USER_KEY);
	if (actorUser) {
		localStorage.setItem("user", actorUser);
	}

	localStorage.removeItem(IMPERSONATION_TOKEN_KEY);
	localStorage.removeItem(IMPERSONATION_ACTOR_USER_KEY);
	localStorage.removeItem(IMPERSONATION_TARGET_USER_KEY);
	localStorage.removeItem(IMPERSONATION_EXPIRES_AT_KEY);
};

const getImpersonationState = () => {
	const token = localStorage.getItem(IMPERSONATION_TOKEN_KEY);
	const actorUserRaw = localStorage.getItem(IMPERSONATION_ACTOR_USER_KEY);
	const targetUserRaw = localStorage.getItem(IMPERSONATION_TARGET_USER_KEY);
	const expiresAt = localStorage.getItem(IMPERSONATION_EXPIRES_AT_KEY);

	return {
		isImpersonating: Boolean(token),
		token,
		expiresAt,
		actorUser: actorUserRaw ? JSON.parse(actorUserRaw) : null,
		targetUser: targetUserRaw ? JSON.parse(targetUserRaw) : null,
	};
};

const isImpersonating = () =>
	Boolean(localStorage.getItem(IMPERSONATION_TOKEN_KEY));

const impersonationService = {
	startImpersonation,
	stopImpersonation,
	getImpersonationState,
	isImpersonating,
	clearImpersonationLocally,
};

export default impersonationService;
