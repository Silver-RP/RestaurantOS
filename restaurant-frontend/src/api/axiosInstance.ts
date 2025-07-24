import axios from "axios";
import Cookies from "js-cookie";
import { refreshAccessToken } from "./AuthApi";
import { toast } from "react-toastify";
import { store } from "@/redux/store";
import { logout } from "@/redux/feature/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];
let isLoggingOut = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const forceLogoutAndRedirect = () => {
  if (isLoggingOut) return; 
  isLoggingOut = true;

  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("userInfo");
  store.dispatch(logout({}));

  toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
  setTimeout(() => {
    window.location.href = "/login";
    isLoggingOut = false;
  }, 1500);
};

axiosInstance.interceptors.request.use(
  config => {
    const token = Cookies.get("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      forceLogoutAndRedirect();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshAccessToken();
        const newAccessToken = res?.accessToken;

        if (!newAccessToken) throw new Error("No access token received");

        Cookies.set("accessToken", newAccessToken, {
          expires: 1 / 24,
          sameSite: import.meta.env.PROD ? "None" : "Lax",
          secure: import.meta.env.PROD,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogoutAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
