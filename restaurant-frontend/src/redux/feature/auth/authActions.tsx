import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 
import { RegisterPayload } from './authTypes';
import { LoginPayload } from './authTypes';
// Register 
const BASE_URL_REGISTER = import.meta.env.VITE_BACKEND_URL; 
const BASE_URL_LOGIN = import.meta.env.VITE_BACKEND_URL;
export const RegisterUser = createAsyncThunk(
    'auth/register',
    async (payload: RegisterPayload, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${BASE_URL_REGISTER}/auth/register`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
      } catch (error: any) {
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
            const response = await axios.post(`${BASE_URL_LOGIN}/login`, payload, {
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
)
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
)
