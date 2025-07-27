import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RegisterPayload, LoginPayload } from './authTypes';
import Cookies from 'js-cookie';
import { 
  setAuthData, 
  clearAuthCookies, 
  setAccessToken,
  setRefreshToken,
  setUserInfo 
} from '../../../utils/tokenHelpers';
import { clearFavorites } from '../favorite/favoriteSlice';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const apiRequest = async (
  url: string,
  payload: object,
  method: 'POST' | 'GET',
) => {
  try {
    const response = await axios({
      method,
      url,
      data: payload,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || 'An error occurred';
      throw new Error(msg);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const RegisterUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(
        `${BASE_URL}/auth/register`,
        payload,
        'POST',
      );
      return data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { message: string })?.message ||
        'An unexpected error occurred',
      );
    }
  },
);

export const LoginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/login`, payload, 'POST');
      const { accessToken, refreshToken, user, message, isBirthday } = data;

      // Validation
      if (!accessToken) {
        console.warn('⚠️ accessToken is missing in API response');
        return rejectWithValue('Invalid server response: missing access token');
      }

      if (!refreshToken) {
        console.warn('⚠️ refreshToken is missing in API response');
        return rejectWithValue('Invalid server response: missing refresh token');
      }

      // Set cookies - in production this might be done by backend
      setAuthData(accessToken, refreshToken, user, payload.rememberMe);

      return { 
        token: accessToken, 
        user, 
        message, 
        isBirthday,
        rememberMe: payload.rememberMe 
      };
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { message: string })?.message || 'Login failed',
      );
    }
  },
);

export const LogoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/logout`, {}, 'POST');
      
      dispatch(clearFavorites());
      clearAuthCookies();
      
      window.dispatchEvent(new CustomEvent('auth:logout', { 
        detail: { type: 'manual' } 
      }));
      
      return data;
    } catch (error: unknown) {
      console.warn('Logout API failed, but clearing local data anyway');
      dispatch(clearFavorites());
      clearAuthCookies();
      
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Logout API failed but local data cleared',
        );
      }
      return rejectWithValue('Logout failed but local data cleared');
    }
  },
);

// Force Logout (automatic, triggered by token expiry)
export const forceLogout = createAsyncThunk(
  'auth/forceLogout',
  async (reason: string = 'Token expired', { dispatch }) => {
    console.log(`🔒 Force logout triggered: ${reason}`);
    
    // Don't call logout API since tokens are already invalid
    dispatch(clearFavorites());
    clearAuthCookies();
    
    // Notify other parts of app
    window.dispatchEvent(new CustomEvent('auth:logout', { 
      detail: { type: 'automatic', reason } 
    }));
    
    return { reason };
  },
);

export const LoginWithGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (
    { credential, rememberMe }: { credential: string; rememberMe: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/google-login`,
        { token: credential, rememberMe },
        { withCredentials: true },
      );

      const { accessToken, refreshToken, user } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken, rememberMe); // Only test

      const userInfoWithGoogleFlag = { ...user, isGoogleLogin: true };
      Cookies.set('userInfo', JSON.stringify(userInfoWithGoogleFlag), {
        path: '/',
        sameSite: 'Lax',
      });

      console.log('Saved userInfoWithGoogleFlag: ', userInfoWithGoogleFlag);
      const userInfo = JSON.parse(Cookies.get('userInfo') || '{}');
      console.log('Saved userInfo: ', userInfo);

      return {
        token: accessToken,
        user,
        message: 'Đăng nhập Google thành công',
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Lỗi khi đăng nhập Google',
        );
      }
      return rejectWithValue('Lỗi khi đăng nhập Google');
    }
  },
);

export const refreshTokenAction = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${BASE_URL}/auth/refresh`, {}, 'POST');
      const { accessToken } = data;

      if (!accessToken) {
        throw new Error('No access token received from refresh');
      }

      setAccessToken(accessToken);

      return { accessToken };
    } catch (error: unknown) {
      console.error('Token refresh failed:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Token refresh failed',
        );
      }
      return rejectWithValue('Token refresh failed');
    }
  },
);


// export const LoginWithGoogle = createAsyncThunk(
//   'auth/loginWithGoogle',
//   async (payload: { token: string; rememberMe?: boolean }, { rejectWithValue }) => {
//     try {
//       const data = await apiRequest(`${BASE_URL}/auth/google`, payload, 'POST');
//       const { accessToken, refreshToken, user, message } = data;

//       if (!accessToken || !refreshToken) {
//         return rejectWithValue('Invalid server response: missing tokens');
//       }

//       setAuthData(accessToken, refreshToken, user, payload.rememberMe);

//       return { token: accessToken, user, message };
//     } catch (error: unknown) {
//       return rejectWithValue(
//         (error as { message: string })?.message || 'Google login failed',
//       );
//     }
//   },
// );