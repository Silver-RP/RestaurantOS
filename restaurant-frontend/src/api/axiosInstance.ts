/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './AuthApi';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];
let redirectingToLogin = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  if (redirectingToLogin || window.location.pathname === '/login') return;
  
  redirectingToLogin = true;
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('userInfo');
  
  // Reset redirect flag after navigation
  const resetRedirectFlag = () => {
    redirectingToLogin = false;
    window.removeEventListener('unload', resetRedirectFlag);
  };
  window.addEventListener('unload', resetRedirectFlag);
  toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
  setTimeout(() => {
    window.location.href = '/login';
  }, 2000);
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAccessToken();
        const newAccessToken = response?.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token received');
        }

        // Set new access token
        Cookies.set('accessToken', newAccessToken, {
          expires: 1 / 24, // 1 hour
          sameSite: import.meta.env.PROD ? 'None' : 'Lax',
          secure: import.meta.env.PROD,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;