import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';
import { RegisterUser, LoginUser } from './authActions';
const initialState: AuthState = {
    userInfo: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success: null,
    message: null,
    token: null,
  };
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout: (state) => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      },
      loadUserFromStorage: (state) => {
        const userInfo = localStorage.getItem('userInfo');
        const token = localStorage.getItem('token');
        if (userInfo && token) {
          state.userInfo = JSON.parse(userInfo);
          state.token = token;
          state.isAuthenticated = true;
        }
      },
      clearStatus: (state) => {
        state.error = null;
        state.success = null;
        state.message = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(LoginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(LoginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string; message: string }>) => {
          state.loading = false;
          state.userInfo = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.message = action.payload.message;
          localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
          localStorage.setItem('token', action.payload.token);
        })
        .addCase(LoginUser.rejected, (state, action: PayloadAction<{ error: string }>) => {
          state.loading = false;
          state.error = action.payload.error;
          state.isAuthenticated = false;
        })
  
        .addCase(RegisterUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(RegisterUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
          state.loading = false;
          state.success = 'Registered successfully';
          state.message = action.payload.message;
        })
        .addCase(RegisterUser.rejected, (state, action: PayloadAction<{ error: string }>) => {
          state.loading = false;
          state.error = action.payload.error;
        });
    },
  });
  
  export const { logout, loadUserFromStorage, clearStatus } = authSlice.actions;
  export default authSlice.reducer;