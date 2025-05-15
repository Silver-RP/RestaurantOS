
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserById, updateUserInfoAPI } from '../../../api/UserApi';
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
