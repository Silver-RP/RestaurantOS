import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchModalState {
  isOpen: boolean;
  query: string;
}

const initialState: SearchModalState = {
  isOpen: false,
  query: '',
};

const searchModalSlice = createSlice({
  name: 'searchModal',
  initialState,
  reducers: {
    openSearchModal: (state) => {
      state.isOpen = true;
    },
    closeSearchModal: (state) => {
      state.isOpen = false;
      state.query = '';
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const {
  openSearchModal,
  closeSearchModal,
  setSearchQuery,
} = searchModalSlice.actions;

export default searchModalSlice.reducer;