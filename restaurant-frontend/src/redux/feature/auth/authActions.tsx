import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 
import { RegisterPayload } from './authTypes';
import { LoginPayload } from './authTypes';
// Register 
const BASE_URL_REGISTER = import.meta.env.VITE_API_AUTH_URL; 
const BASE_URL_LOGIN = import.meta.env.VITE_API_AUTH_URL;
export const RegisterUser = createAsyncThunk(
    'auth/register',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            console.log("BASE_URL_REGISTER", BASE_URL_REGISTER);
            const response = await axios.post(`${BASE_URL_REGISTER}/register`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response", response.data);
            
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || 'Đăng ký thất bại, vui lòng thử lại');
              }
        }
    }
)
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
