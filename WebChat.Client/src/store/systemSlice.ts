import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PhoneNumber } from "../types/PhoneNumber";
import { SystemInfo } from "../types/SystemInfo";

const initSystem: SystemInfo = {
  version: "1.0.0",
  appName: "WebChat",
  adminPhone: new PhoneNumber(84, 382441609),
  email: "phancongthanhvtvpvn@gmail.com",
  globalGroupCode: "WebChat",
  maxFileSize: 0.5,
  maxFileCountPerMessage: 5,
};

const systemSlice = createSlice({
  name: "system",
  initialState: initSystem,
  reducers: {
    setInfo: (_, action: PayloadAction<SystemInfo>) => action.payload,
  },
});

export const { setInfo } = systemSlice.actions;
export default systemSlice.reducer;
