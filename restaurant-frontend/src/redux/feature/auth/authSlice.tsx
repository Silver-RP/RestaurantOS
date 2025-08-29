import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';
import { 
  RegisterUser, 
  LoginUser, 
  LogoutUser, 
  LoginWithGoogle, 
  forceLogout,
  refreshTokenAction 
} from './authActions';
import { getUserInfo } from '../../../utils/tokenHelpers';

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
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear all status messages
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
      state.message = null;
    },
    
    // Set user info (for manual updates)
    setUser: (state, action: PayloadAction<User | null>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    
    // Load user from storage (on app init)
    loadUserFromStorage: (state) => {
      const userInfo = getUserInfo();
      if (userInfo) {
        state.userInfo = userInfo;
        state.isAuthenticated = true;
      }
    },
    
    // Manual logout (clear Redux state only)
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isBirthday = false;
      state.error = null;
      state.success = null;
      state.message = null;
      // Note: Don't clear cookies here, let actions handle it
    },
    
    // Update user info (for profile updates)
    updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        const { user, token, message, isBirthday } = action.payload;
        state.loading = false;
        state.userInfo = user;
        state.token = token;
        state.isAuthenticated = true;
        state.message = message;
        state.isBirthday = isBirthday || false;
        state.error = null;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.token = null;
      })

      // 🟩 Google Login
      .addCase(LoginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginWithGoogle.fulfilled, (state, action) => {
        const { user, token, message } = action.payload;
        state.loading = false;
        state.userInfo = user;
        state.token = token;
        state.isAuthenticated = true;
        state.message = message;
        state.error = null;
      })
      .addCase(LoginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.token = null;
      })

      // 🟨 Register
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Registered successfully';
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = null;
      })

      // 🟥 Manual Logout
      .addCase(LogoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isBirthday = false;
        state.loading = false;
        state.error = null;
        state.success = 'Logged out successfully';
        localStorage.removeItem('accessToken');
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        // Still clear user data even if API call failed
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isBirthday = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 🟥 Force Logout (automatic)
      .addCase(forceLogout.fulfilled, (state, action) => {
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isBirthday = false;
        state.loading = false;
        state.error = `Phiên đăng nhập đã hết hạn: ${action.payload.reason}`;
        state.success = null;
        state.message = null;
      })
      
      // 🔄 Refresh Token
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
      })
      .addCase(refreshTokenAction.rejected, (state) => {
        // Token refresh failed, but don't logout here
        // Let axios interceptor handle the logout
        console.log('Token refresh failed in reducer');
      });
  },
});

export const { 
  clearError, 
  clearStatus, 
  setUser, 
  loadUserFromStorage, 
  logout,
  updateUserInfo 
} = authSlice.actions;

export default authSlice.reducer;