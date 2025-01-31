import { auth } from "./firebaseConfig";
import axios from "axios";

interface AuthState {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	user: any | null;
}

class AuthService {
	private static instance: AuthService;
	private authState: AuthState = {
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
		user: null,
	};

	private constructor() {
		const accessToken = localStorage.getItem("jwt");
		const refreshToken = localStorage.getItem("refreshToken");
		if (accessToken && refreshToken) {
			this.authState.accessToken = accessToken;
			this.authState.refreshToken = refreshToken;
			this.authState.isAuthenticated = true;
		}
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	private handleToken(
		accessToken: string,
		refreshToken: string,
		user: any
	): void {
		localStorage.setItem("jwt", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
		localStorage.setItem("user", JSON.stringify(user));
		this.authState.user = user;
		this.authState.accessToken = accessToken;
		this.authState.refreshToken = refreshToken;
		this.authState.isAuthenticated = true;
		axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	}

	async refreshTokens(): Promise<void> {
		try {
			const currentUser = auth.currentUser;
			if (!currentUser) {
				throw new Error("No user signed in");
			}

			const firebaseToken = await currentUser.getIdToken(true);
			const response = await axios.post(
				"/api/login/refresh",
				{},
				{
					headers: {
						Authorization: `Bearer ${this.authState.accessToken}`,
						"Refresh-Token": firebaseToken,
					},
				}
			);

			const { accessToken, refreshToken } = response.data;

			localStorage.setItem("jwt", accessToken);
			localStorage.setItem("refreshToken", refreshToken);

			this.authState.accessToken = accessToken;
			this.authState.refreshToken = refreshToken;

			axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
		} catch (error) {
			await this.logout();
			throw error;
		}
	}

	async login(email: string, password: string): Promise<void> {
		try {
			console.log("Attempting Firebase login...");
			const userCredential = await auth.signInWithEmailAndPassword(
				email,
				password
			);
			console.log("Firebase login successful");

			if (!userCredential.user) {
				throw new Error("Failed to get user credentials");
			}

			const firebaseToken = await userCredential.user.getIdToken();
			if (!firebaseToken) {
				throw new Error("Failed to get Firebase token");
			}

			console.log("Getting user data from backend...");
			const response = await axios.post(
				"http://localhost:5001/api/login",
				{
					firebaseId: userCredential.user.uid,
					email: userCredential.user.email,
				},
				{
					headers: {
						Authorization: `Bearer ${firebaseToken}`,
					},
				}
			);

			console.log("Backend login response:", response.data);
			const { accessToken, refreshToken, user } = response.data;
			this.handleToken(accessToken, refreshToken, user);
		} catch (error: any) {
			console.error("Login error details:", error);
			if (error.code === "auth/invalid-credential") {
				throw new Error("Invalid email or password. Please try again.");
			} else if (error.code === "auth/user-not-found") {
				throw new Error(
					"No account found with this email. Please register first."
				);
			} else {
				throw new Error(error.message || "Login failed. Please try again.");
			}
		}
	}

	async logout(): Promise<void> {
		try {
			await auth.signOut();
			localStorage.removeItem("jwt");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
			this.authState = {
				isAuthenticated: false,
				accessToken: null,
				refreshToken: null,
				user: null,
			};
			delete axios.defaults.headers.common["Authorization"];
		} catch (error) {
			throw error;
		}
	}

	isAuthenticated(): boolean {
		return this.authState.isAuthenticated;
	}

	getToken(): string | null {
		return this.authState.accessToken;
	}

	getUser(): any | null {
		return this.authState.user;
	}

	async register(email: string, password: string, name: string): Promise<void> {
		try {
			console.log("Creating Firebase user...");
			const userCredential = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			console.log("Firebase user created:", userCredential.user);

			const firebaseToken = await userCredential.user?.getIdToken();
			console.log("Got Firebase token:", firebaseToken ? "Yes" : "No");

			if (!userCredential.user || !firebaseToken) {
				throw new Error("Failed to create Firebase user");
			}

			const baseURL = "http://localhost:5001";
			console.log(
				"Making backend request to:",
				`${baseURL}/api/login/register`
			);

			const response = await axios.post(
				`${baseURL}/api/login/register`,
				{
					firebaseId: userCredential.user.uid,
					email,
					name,
					role: "foster parent",
					isColorado: true,
				},
				{
					headers: {
						Authorization: `Bearer ${firebaseToken}`,
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);

			console.log("Backend response:", response.data);
			const { accessToken, refreshToken, user } = response.data;
			this.handleToken(accessToken, refreshToken, user);
		} catch (error: any) {
			console.error("Registration error details:", error);
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error("Error response data:", error.response.data);
				console.error("Error response status:", error.response.status);
				console.error("Error response headers:", error.response.headers);
			}
			// If backend creation fails, delete the Firebase user
			const currentUser = auth.currentUser;
			if (currentUser) {
				await currentUser.delete();
			}
			throw error;
		}
	}
}

export default AuthService.getInstance();
