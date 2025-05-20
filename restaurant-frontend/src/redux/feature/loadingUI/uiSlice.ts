
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  overlayLoading: boolean;
  overlayMessage: string | null;
}

const initialState: UIState = {
  overlayLoading: false,
  overlayMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showOverlayLoading: (state, action: PayloadAction<string | undefined>) => {
      state.overlayLoading = true;
      state.overlayMessage = action.payload || null;
    },
    hideOverlayLoading: (state) => {
      state.overlayLoading = false;
      state.overlayMessage = null;
    },
  },
});

export const { showOverlayLoading, hideOverlayLoading } = uiSlice.actions;
export default uiSlice.reducer;
