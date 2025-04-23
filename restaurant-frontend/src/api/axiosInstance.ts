import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './AuthApi';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // Quan trọng để backend gửi cookies (ví dụ refreshToken)
});

let isRefreshing = false;
let failedQueue: any[] = [];

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

// ✅ Gắn accessToken từ cookie (không tạo token ở FE)
axiosInstance.interceptors.request.use(config => {
  const accessToken = Cookies.get('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ Tự động refresh nếu token hết hạn
axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(error => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAccessToken(); 
        const newAccessToken = response?.accessToken;

        if (!newAccessToken) throw new Error('No access token received');
        Cookies.set('accessToken', newAccessToken, {
          expires: 1 / (24 * 60), 
          sameSite: 'Lax',
          secure: false,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
