import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './userTypes';
import {
  fetchCurrentUser,
  fetchUserById,
  updateUserInfo,
  updateUserProfile,
} from './userAction';

const initialState: UserState = {
  user: null,
  selectedUser: null,
  loading: false,
  error: null,
  loadingUpdate: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.selectedUser = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      })
      // fetchCurrentUser (dùng cho trang Profile)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể lấy hồ sơ người dùng';
      })
      // updateUserInfo
      .addCase(updateUserInfo.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
          status: action.payload.status ?? state.user?.status ?? 'active',
        };
        state.loadingUpdate = false;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload || 'Cập nhật thất bại';
      });

    // update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
          status: action.payload.status ?? state.user?.status ?? 'active',
        };
        state.loadingUpdate = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload || 'Cập nhật thất bại';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
