import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RegisterPayload, LoginPayload } from './authTypes';

const BASE_URL_REGISTER = import.meta.env.VITE_API_AUTH_URL;
const BASE_URL_LOGIN = import.meta.env.VITE_API_AUTH_URL;

// Register
export const RegisterUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL_REGISTER}/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || 'Đăng ký thất bại, vui lòng thử lại'
        );
      }
    }
  }
);

// Login
export const LoginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL_LOGIN}/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('RESPONSE FROM LOGIN API:', response.data);  // Log response

      const { token, user, message } = response.data;

      // Check if token is missing
      if (!token) {
        console.warn('⚠️ Token is missing in API response:', response.data);
      }

      // Save token to localStorage or sessionStorage
      if (payload.rememberMe) {
        localStorage.setItem('accessToken', token || '');
        localStorage.setItem('userInfo', JSON.stringify(user || {}));
      } else {
        sessionStorage.setItem('accessToken', token || '');
        sessionStorage.setItem('userInfo', JSON.stringify(user || {}));
      }

      return { token, user, message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định');
    }
  }
);

// Logout
export const LogoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL_LOGIN}/logout`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
