import apiClient from "./apiClient";

export async function fetchUserProgress() {
	try {
		const response = await apiClient.get(
			`/progress/progress/${JSON.parse(localStorage.user)._id}`
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching user progress:",
			// @ts-ignore
			error.response?.data || error.message
		);
	}
}
