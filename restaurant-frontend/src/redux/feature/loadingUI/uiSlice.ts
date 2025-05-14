import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  overlayLoading: boolean;
}

const initialState: UIState = {
  overlayLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showOverlayLoading: (state) => {
      state.overlayLoading = true;
    },
    hideOverlayLoading: (state) => {
      state.overlayLoading = false;
    },
  },
});

export const { showOverlayLoading, hideOverlayLoading } = uiSlice.actions;
export default uiSlice.reducer;