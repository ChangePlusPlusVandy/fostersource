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

  private handleToken(accessToken: string, refreshToken: string, user: any): void {
    localStorage.setItem("jwt", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    this.authState = {
      isAuthenticated: true,
      accessToken,
      refreshToken,
      user,
    };
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  async refreshTokens(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user signed in");
      }

      const firebaseToken = await currentUser.getIdToken(true);
      const response = await axios.post("/api/login/refresh", {}, {
        headers: {
          'Authorization': `Bearer ${this.authState.accessToken}`,
          'Refresh-Token': firebaseToken
        }
      });

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
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const firebaseToken = await userCredential.user?.getIdToken();

      const response = await axios.get("/api/login", {
        params: { firebaseId: userCredential.user?.uid },
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });

      const { accessToken, refreshToken, user } = response.data;
      this.handleToken(accessToken, refreshToken, user);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await auth.signOut();
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
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
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const firebaseToken = await userCredential.user?.getIdToken();
      const response = await axios.post("/api/register", {
        firebaseId: userCredential.user?.uid,
        email,
        name,
      }, {
        headers: { Authorization: `Bearer ${firebaseToken}` }
      });

      const { accessToken, refreshToken, user } = response.data;
      this.handleToken(accessToken, refreshToken, user);
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService.getInstance();
