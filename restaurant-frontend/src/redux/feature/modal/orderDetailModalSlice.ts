import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderDetailModalState {
  isOpen: boolean;
  orderId: string | null;
}

const initialState: OrderDetailModalState = {
  isOpen: false,
  orderId: null,
};

const orderDetailModalSlice = createSlice({
  name: 'orderDetailModal',
  initialState,
  reducers: {
    openOrderModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.orderId = action.payload;
    },
    closeOrderModal: (state) => {
      state.isOpen = false;
      state.orderId = null;
    },
  },
});

export const { openOrderModal, closeOrderModal } = orderDetailModalSlice.actions;
export default orderDetailModalSlice.reducer;