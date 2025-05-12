import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // <-- Missing import
import { RegisterPayload, LoginPayload } from './authTypes';


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function for handling API requests
const apiRequest = async (url: string, payload: object, method: 'POST' | 'GET') => {
  try {
    const response = await axios({ method, url, data: payload, headers: { 'Content-Type': 'application/json' } });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || 'An error occurred';
      throw new Error(msg);
    }
    throw new Error('An unexpected error occurred');
  }
};
import { setAccessToken } from '@/utils/tokenHelpers';


// Register
export const RegisterUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/register`, payload, 'POST');
      return data;
    } catch (error: unknown) {
      return rejectWithValue((error as { message: string })?.message || 'An unexpected error occurred');
    }
  }
);

// Login
export const LoginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/login`, payload, 'POST');
      const { token, user, message } = data;

      if (!token) {
        console.warn('⚠️ Token is missing in API response');
      }
      setAccessToken(token, payload.rememberMe);
      // setRefreshToken(refreshToken, payload.rememberMe);

      const storage = payload.rememberMe ? localStorage : sessionStorage;
      storage.setItem('accessToken', token || '');
      storage.setItem('userInfo', JSON.stringify(user || {}));

      return { token, user, message };
    } catch (error: unknown) {
      return rejectWithValue((error as { message: string })?.message || 'An unexpected error occurred');
    }
  }
);

// Logout
export const LogoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/logout`, {}, 'POST');
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
