import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodDetail } from 'types/Dish.types';

interface QuickViewState {
  selectedProduct: FoodDetail | null;
  isOpen: boolean;
}

const initialState: QuickViewState = {
  selectedProduct: null,
  isOpen: false,
};

const quickViewSlice = createSlice({
  name: 'quickView',
  initialState,
  reducers: {
    openQuickView(state, action: PayloadAction<FoodDetail>) {
      state.selectedProduct = action.payload;
      state.isOpen = true;
    },
    closeQuickView(state) {
      state.selectedProduct = null;
      state.isOpen = false;
    },
  },
});

export const { openQuickView, closeQuickView } = quickViewSlice.actions;
export default quickViewSlice.reducer;