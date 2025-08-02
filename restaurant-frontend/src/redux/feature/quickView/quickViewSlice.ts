import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodDetail } from 'types/Dish.types';

interface QuickViewPayload {
  product: FoodDetail;
  hideAddToCart?: boolean;
}

interface QuickViewState {
  selectedProduct: FoodDetail | null;
  isOpen: boolean;
  hideAddToCart: boolean;
}

const initialState: QuickViewState = {
  selectedProduct: null,
  isOpen: false,
  hideAddToCart: false,
};

const quickViewSlice = createSlice({
  name: 'quickView',
  initialState,
  reducers: {
    openQuickView(state, action: PayloadAction<QuickViewPayload>) {
      state.selectedProduct = action.payload.product;
      state.isOpen = true;
      state.hideAddToCart = action.payload.hideAddToCart ?? false;
    },
    closeQuickView(state) {
      state.selectedProduct = null;
      state.isOpen = false;
      state.hideAddToCart = false;
    },
  },
});

export const { openQuickView, closeQuickView } = quickViewSlice.actions;
export default quickViewSlice.reducer;
