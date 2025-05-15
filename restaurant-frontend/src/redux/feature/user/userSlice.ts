import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './userTypes';
import { fetchUserById, updateUserInfo } from './userAction';

const initialState: UserState = {
  user: null,
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
          state.user = {
            ...state.user,
            ...action.payload,
            phone: action.payload.phone ?? state.user?.phone ?? '',
          };
          state.loading = false;
        },
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
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
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
