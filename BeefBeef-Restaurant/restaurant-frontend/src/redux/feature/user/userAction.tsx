import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserById, updateUserInfoAPI } from '../../../api/UserApi';
import { User } from 'types/User.type';
import { AxiosError } from 'axios';
import { getProfile, updateProfile } from '@/api/ProfileApi';

export const fetchUserById = createAsyncThunk<
  User, 
  { userId: string }, 
  { rejectValue: string } 
>(
  'user/fetchUserById',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const user = await getUserById(userId);
      return user;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || 'Không thể tải thông tin người dùng';
      return rejectWithValue(message);
    }
  }
);

export const updateUserInfo = createAsyncThunk<
  User,
  { userId: string; data: Partial<User> },
  { rejectValue: string }
>('user/updateUserInfo', async ({ userId, data }, { rejectWithValue }) => {
  try {
    const res = await updateUserInfoAPI(userId, data);
    return res.data;
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'Cập nhật thất bại';
    return rejectWithValue(msg);
  }
});

export const fetchCurrentUser = createAsyncThunk<
  User,
  { userId: string },
  { rejectValue: string }
>(
  'user/fetchCurrentUser',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await getProfile(userId);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || 'Không thể lấy thông tin hồ sơ';
      return rejectWithValue(msg);
    }
  }
);


export const updateUserProfile = createAsyncThunk<
  User, 
  { userId: string; data: Partial<User> }, 
  { rejectValue: string } 
>(
  'user/updateUserProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await updateProfile(userId, data); 
      if (!res?.data) {
        return rejectWithValue('Cập nhật profile thất bại');
      }
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error.response?.data?.message || 'Cập nhật profile thất bại';
      return rejectWithValue(msg);
    }
  }
);