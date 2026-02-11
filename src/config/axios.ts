import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true, // REQUIRED for httpOnly cookies
});

// Flag to avoid infinite refresh loops
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Response interceptor for auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call refresh endpoint
          const refreshRes = await api.get("/api/auth/refresh");
          isRefreshing = false;

          // Notify waiting requests
          onRefreshed("token-renewed");

          return api(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          console.error("Refresh token failed:", refreshErr);
          window.location.href = "/login";
          return Promise.reject(refreshErr);
        }
      }

      // Queue requests while refresh runs
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
