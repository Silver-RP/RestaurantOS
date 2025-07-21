import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';
import { RegisterUser, LoginUser, LogoutUser, LoginWithGoogle } from './authActions';
import Cookies from 'js-cookie';

const initialState: AuthState = {
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null,
  message: null,
  token: null,
  isBirthday: false,
};

const authSlice: Slice<AuthState> = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isBirthday = false;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('accessToken');
    },
    loadUserFromStorage: (state) => {
      const userInfo =
        localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      const token =
        localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

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
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = {
        _id: action.payload._id || '', // Provide a default or actual value
        username: action.payload.email,
        email: action.payload.email,
        roles: action.payload.roles || [],
        isActive: true, 
        isEmailVerified: false, 
        avatar: action.payload.avatar || '', // Provide a default or actual value
        createdAt: action.payload.createdAt || '', // Provide a default or actual value
        updatedAt: action.payload.updatedAt || '', // Provide a default or actual value
      };
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // 🟦 Normal Login
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        LoginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string; message: string; isBirthday: boolean }>) => {
          const { user, token, message, isBirthday } = action.payload;
          state.loading = false;
          state.userInfo = user;
          state.token = token;
          state.isAuthenticated = Boolean(token);
          state.message = message;
          state.isBirthday = isBirthday;
        }
      )
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // 🟩 Google Login
      .addCase(LoginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        LoginWithGoogle.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string; message: string }>) => {
          const { user, token, message } = action.payload;
          state.loading = false;
          state.userInfo = user;
          state.token = token;
          state.isAuthenticated = Boolean(token);
          state.message = message;
        }
      )
      .addCase(LoginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // 🟨 Register
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RegisterUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.success = 'Registered successfully';
        state.message = action.payload.message;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟥 Logout
      .addCase(LogoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isBirthday = false;
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userInfo');
      });
  },
});

export const { logout, loadUserFromStorage, clearStatus, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
