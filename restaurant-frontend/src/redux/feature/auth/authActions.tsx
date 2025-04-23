import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RegisterPayload, LoginPayload } from './authTypes';
import Cookies from 'js-cookie'; 


const BASE_URL_REGISTER = import.meta.env.VITE_BACKEND_URL;
const BASE_URL_LOGIN = import.meta.env.VITE_BACKEND_URL;

// Register
export const RegisterUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL_REGISTER}/auth/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Đăng ký thất bại';
        return rejectWithValue(msg);
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định');
    }
  }
);

// Login
export const LoginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL_LOGIN}/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('RESPONSE FROM LOGIN API:', response.data);

      const { accessToken: token, refreshToken, user, message } = response.data;

      if (!token) {
        console.warn('Token is missing in API response:', response.data);
      }

      if (payload.rememberMe) {
        Cookies.set('accessToken', token, { expires: 7 }); 
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
      } else {
        Cookies.set('accessToken', token);
        Cookies.set('refreshToken', refreshToken);
      }

      return { token, refreshToken, user, message };
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