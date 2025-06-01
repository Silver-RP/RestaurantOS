import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth/authSlice';
import quickViewReducer from './feature/quickView/quickViewSlice';
import searchModalReducer from './feature/modal/searchModalSlice';
import reservationModalReducer from './feature/modal/reservationModalSlice';
import orderDetailModalReducer from './feature/modal/orderDetailModalSlice';
import userReducer from './feature/user/userSlice';
import uiReducer from './feature/loadingUI/uiSlice';
import favoriteReducer from './feature/favorite/favoriteSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    quickView: quickViewReducer,
    searchModal: searchModalReducer,
    ui: uiReducer,
    user: userReducer,
    favorite: favoriteReducer,
    reservationModal: reservationModalReducer,
    orderDetailModal: orderDetailModalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
  devTools: import.meta.env.MODE !== 'production', 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;