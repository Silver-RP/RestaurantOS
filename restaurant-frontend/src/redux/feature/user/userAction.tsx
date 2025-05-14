import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserById } from '../../../api/UserApi';
import { User } from 'types/User.type';
import { AxiosError } from 'axios';

export const fetchUserById = createAsyncThunk<
  User, 
  { userId: string; token: string }, 
  { rejectValue: string } 
>(
  'user/fetchUserById',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const user = await getUserById(userId, token);
      return user;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message || 'Không thể tải thông tin người dùng';
      return rejectWithValue(message);
    }
  }
);