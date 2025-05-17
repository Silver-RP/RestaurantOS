import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from './AuthApi';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: any[] = [];
let redirectingToLogin = false; // Thêm flag kiểm tra việc chuyển hướng

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

// Interceptor Request
axiosInstance.interceptors.request.use(config => {
  const accessToken = Cookies.get('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor Response
axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    // Kiểm tra lỗi 401
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
        // Kiểm tra xem đã chuyển hướng đến login chưa
        if (redirectingToLogin) {
          return Promise.reject(err);
        }

        redirectingToLogin = true; // Đánh dấu đã chuyển hướng
        const response = await refreshAccessToken();
        const newAccessToken = response?.accessToken;

        if (!newAccessToken) throw new Error('No access token received');
        Cookies.set('accessToken', newAccessToken, {
          expires: 1 / (24 * 60), // token hết hạn sau 1 phút (có thể thay đổi tùy ý)
          sameSite: 'Lax',
          secure: false,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        Cookies.remove('accessToken');
        window.location.href = '/login';
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        redirectingToLogin = false; 
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
