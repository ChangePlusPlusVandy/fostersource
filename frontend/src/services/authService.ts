import firebase from "firebase/compat";
import { auth } from "./firebaseConfig";
import apiClient from "./apiClient"; // Use the shared API client for consistency
import axios from "axios";

interface AuthState {
	isAuthenticated: boolean;
	user: firebase.User | null;
}

interface RegisterCredentials {
	email: string;
	password: string;
	name: string;
	phone: string;
	certification: string;
	company: string;
	userType: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}
class AuthService {
	private static instance: AuthService;
	private authState: AuthState = {
		isAuthenticated: false,
		user: null,
	};

	private constructor() {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			// @ts-ignore
			this.authState.user = storedUser;
			this.authState.isAuthenticated = true;
		}
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	private async updateAuthState(user: any, token: string): Promise<void> {
		if (user) {
			this.authState.user = user;
			this.authState.isAuthenticated = true;
			if (user.cart !== "") {
				user.cart = JSON.parse(user.cart);
			}
			localStorage.setItem("user", JSON.stringify(user));
			apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			this.authState.user = null;
			this.authState.isAuthenticated = false;
			localStorage.removeItem("user");
			delete apiClient.defaults.headers.common["Authorization"];
		}
	}

	async login(email: string, password: string): Promise<void> {
		try {
			const userCredential = await auth.signInWithEmailAndPassword(
				email,
				password
			);

			if (!userCredential.user) {
				throw new Error("Failed to create Firebase user");
			}

			const firebaseToken = await userCredential.user?.getIdToken();

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

			const user = response.data.user;

			await this.updateAuthState(user, firebaseToken);
		} catch (error: any) {
			console.error("Login error:", error);
			throw new Error(error.message || "Login failed. Please try again.");
		}
	}

	async logout(): Promise<void> {
		try {
			await auth.signOut();
			localStorage.removeItem("user");
			this.authState = {
				isAuthenticated: false,
				user: null,
			};
			delete axios.defaults.headers.common["Authorization"];
		} catch (error) {
			console.error("Logout failed:", error);
			throw error;
		}
	}

	isAuthenticated(): boolean {
		return this.authState.isAuthenticated;
	}

	getUser(): firebase.User | null {
		return this.authState.user;
	}

	async register({
		email,
		password,
		name,
		phone,
		certification,
		company,
		userType,
		address1,
		address2,
		city,
		state,
		country,
		zip,
	}: RegisterCredentials): Promise<void> {
		try {
			const userCredential = await auth.createUserWithEmailAndPassword(
				email,
				password
			);

			if (!userCredential.user) {
				throw new Error("Failed to create Firebase user");
			}

			const firebaseToken = await userCredential.user?.getIdToken();

			const baseURL = "http://localhost:5001";

			const fallback = (val: string | undefined, fallbackVal = "N/A") =>
				val && val.trim() !== "" ? val : fallbackVal;

			const response = await axios.post(
				`${baseURL}/api/login/register`,
				{
					firebaseId: userCredential.user.uid,
					email,
					name,
					phone: fallback(phone),
					certification,
					company: fallback(company),
					role: userType,
					address1: fallback(address1),
					address2: fallback(address2),
					city: fallback(city),
					state: fallback(state),
					country: fallback(country),
					zip: fallback(zip),
					isColorado: state === "Colorado",
				},
				{
					headers: {
						Authorization: `Bearer ${firebaseToken}`,
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);

			const user = response.data.user;

			await this.updateAuthState(user, firebaseToken);
		} catch (error: any) {
			console.error("Registration error:", error);
			throw new Error(
				error.message || "Registration failed. Please try again."
			);
		}
	}
}

export default AuthService.getInstance();
