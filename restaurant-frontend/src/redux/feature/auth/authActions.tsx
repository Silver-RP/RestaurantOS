import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 
import { RegisterPayload, LoginPayload } from './authTypes';
import Cookies from 'js-cookie';
import { setAccessToken, setRefreshToken } from '../../../utils/tokenHelpers';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

// Register
export const RegisterUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/register`, payload, 'POST');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Login
export const LoginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
     
      const data = await apiRequest(`${BASE_URL}/auth/login`, payload, 'POST');
      console.log('Login payload:', payload);
      const { accessToken, refreshToken, user, message } = data;
      
      if (!accessToken) {
        console.warn('⚠️ accessToken is missing in API response');
      }

      setAccessToken(accessToken);
      setRefreshToken(refreshToken, payload.rememberMe);
      Cookies.set('userInfo', JSON.stringify(user), {
        expires: payload.rememberMe ? 21 : 2,
        sameSite: import.meta.env.PROD ? 'None' : 'Lax',
        secure: import.meta.env.PROD,
      });

      return { token: accessToken, user, message }; 
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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const LoginWithGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (googleUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/google-login`,
        { token: googleUser.credential }, 
        { withCredentials: true } 
      );
      const { accessToken, refreshToken, user } = response.data;

      setAccessToken(accessToken);
      // setRefreshToken(refreshToken); 

      return { token: accessToken, user, message: 'Đăng nhập Google thành công' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi đăng nhập Google');
    }
  }
);
