import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth/authSlice';
import quickViewReducer from './feature/quickView/quickViewSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    quickView: quickViewReducer,
    // cart: cartReducer,
    // ... (thêm các slice khác nếu cần)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
  devTools: import.meta.env.MODE !== 'production', 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;