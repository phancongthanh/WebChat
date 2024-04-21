import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initError: unknown | null = null;

const errorSlice = createSlice({
  name: "error",
  initialState: initError,
  reducers: {
    showError: (_, action: PayloadAction<unknown>) => action.payload,
    resetError: () => null,
  },
});

export const { showError, resetError } = errorSlice.actions;
export default errorSlice.reducer;
