import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    makeToggle: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { makeToggle } = toggleSlice.actions;

export default toggleSlice.reducer;
