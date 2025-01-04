import axios from "axios";
import authService from "./authService";

axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers['new-access-token'];
    const newRefreshToken = response.headers['new-refresh-token'];
    
    if (newAccessToken && newRefreshToken) {
      localStorage.setItem("jwt", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authService.refreshTokens();
        return axios(originalRequest);
      } catch (refreshError) {
        await authService.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 403) {
      await authService.logout();
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default axios; 