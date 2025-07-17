import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteItem } from '@/types/Dish.types';

interface FavoriteState {
  items: FavoriteItem[];
}

const initialState: FavoriteState = {
  items: [],
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<FavoriteItem[]>) => {
      state.items = action.payload;
    },
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      state.items.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    removeFavoriteSuccess: (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      }
  },
});

export const { setFavorites, addFavorite, removeFavorite,removeFavoriteSuccess } = favoriteSlice.actions;

export default favoriteSlice.reducer;