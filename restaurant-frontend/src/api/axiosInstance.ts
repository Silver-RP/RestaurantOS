import axios from 'axios';
import { toast } from 'react-toastify';
import { store } from '../redux/store'; 
import { forceLogout } from '../redux/feature/auth/authActions';
import { 
  getAccessToken, 
  setAccessToken, 
  clearAuthCookies 
} from '../utils/tokenHelpers';
import { refreshAccessToken } from './AuthApi';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];
let checkCallHandleAuthFailure = false;

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: QueueItem) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleAuthFailure = (reason: string = 'Token expired') => {
  if (window.location.pathname === '/login') return;
  if (checkCallHandleAuthFailure) return;
  
  console.log(`🔒 Auth failure: ${reason}`);
  store.dispatch(forceLogout(reason));
  clearAuthCookies();
  // toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
  toast.warning('Hãy đăng nhập để trải nghiệm dịch vụ một cách trọn vẹn ♨️.');

  checkCallHandleAuthFailure = true;
  
  // setTimeout(() => {
  //   window.location.href = '/login';
  // }, 1500);
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (originalRequest.url?.includes('/auth/refresh')) {
        handleAuthFailure('Refresh token expired');
        return Promise.reject(error);
      }
      
      if (originalRequest.url?.includes('/auth/logout')) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            }
            return Promise.reject(new Error('No token available'));
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log('🔄 Attempting token refresh...');
        const response = await refreshAccessToken();
        const newAccessToken = response?.accessToken;
        
        if (!newAccessToken) {
          throw new Error('No access token received from refresh');
        }
        
        console.log('✅ Token refresh successful');
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        if (refreshError.response?.status === 401) {
          handleAuthFailure('Refresh token expired');
        } else if (refreshError.code === 'NETWORK_ERROR') {
          handleAuthFailure('Network error during token refresh');
        } else {
          handleAuthFailure('Token refresh failed');
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    if (error.response?.status === 401 && originalRequest._retry) {
      handleAuthFailure('Invalid token after refresh');
    }
    
    if (error.response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;