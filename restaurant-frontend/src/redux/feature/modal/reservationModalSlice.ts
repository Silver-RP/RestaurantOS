import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReservationModalState {
  isOpen: boolean;
  reservationId: string | null;
}

const initialState: ReservationModalState = {
  isOpen: false,
  reservationId: null,
};

const reservationModalSlice = createSlice({
  name: 'reservationModal',
  initialState,
  reducers: {
    openReservationModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.reservationId = action.payload;
    },
    closeReservationModal: (state) => {
      state.isOpen = false;
      state.reservationId = null;
    },
  },
});

export const { openReservationModal, closeReservationModal } = reservationModalSlice.actions;
export default reservationModalSlice.reducer;