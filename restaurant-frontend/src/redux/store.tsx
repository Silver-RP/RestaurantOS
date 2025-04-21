// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ check nếu dùng localStorage/token
    }),
});

// Types cho Redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
