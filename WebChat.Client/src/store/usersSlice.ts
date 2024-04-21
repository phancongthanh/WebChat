import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../types/User";

const initUsers: { [index: string]: User | undefined | null } = {};

const usersSlice = createSlice({
  name: "users",
  initialState: initUsers,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      action.payload.forEach((user) => (state[user.userId] = user));
    },
    setUser: (state, action: PayloadAction<User>) => {
      state[action.payload.userId] = action.payload;
    },
    setNotFoundUser: (state, action: PayloadAction<string>) => {
      state[action.payload] = null;
    },
    setOnline: (state, action: PayloadAction<{ userId: string; time: Date }>) => {
      const user = state[action.payload.userId];
      if (user) user.lastAccessTime = action.payload.time;
    },
  },
});

export const { setUsers, setUser, setNotFoundUser, setOnline } = usersSlice.actions;
export default usersSlice.reducer;
