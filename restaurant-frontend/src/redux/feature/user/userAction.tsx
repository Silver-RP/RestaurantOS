
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserById } from '../../../api/UserApi';
import { User } from 'types/User.type';

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
    } catch (err: any) {
      return rejectWithValue('Không thể tải thông tin người dùng');
    }
  }
);
