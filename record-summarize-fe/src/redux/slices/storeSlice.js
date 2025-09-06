import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  store: null,
  isLoading: false,
}

const slice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    setStore: (state, action) => {
      state.isLoading = false;
      state.store = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    clear: (state) => {
      state.isLoading = false;
      state.store = null;
    },
  }
})

export const { setStore, stopLoading, clear, setLoading } = slice.actions;
export default slice.reducer;
