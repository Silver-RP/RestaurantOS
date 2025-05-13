import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth/authSlice';
import quickViewReducer from './feature/quickView/quickViewSlice';
import searchModalReducer from './feature/searchModal/searchModalSlice';
import userReducer from './feature/user/userSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    quickView: quickViewReducer,
    searchModal: searchModalReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
  devTools: import.meta.env.MODE !== 'production', 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;