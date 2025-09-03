import axios from "axios";

export const baseInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // send cookies automatically
});

// Add interceptor
baseInstance.interceptors.response.use(
  (response) => response, // Pass through if success
  async (error) => {
    const originalRequest = error.config;

    // If request failed with 401 and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        await baseInstance.post("/staff/auth/refresh-token");

        // Retry the original request
        return baseInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // redirect to login
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);
