import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Gender } from "../enums/Gender";
import { PhoneNumber } from "../types/PhoneNumber";

export interface AuthState {
  userId: string;
  name: string;
  gender: Gender;
  birthday: Date;
  phone: PhoneNumber;
  conversationId: string;
}

const initAuth: AuthState = {
  userId: "",
  name: "",
  gender: Gender.NotKnown,
  birthday: new Date(),
  phone: {
    countryCode: 84,
    subcriberNumber: 0,
  },
  conversationId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initAuth,
  reducers: {
    setAuth: (_, action: PayloadAction<AuthState>) => action.payload,
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
