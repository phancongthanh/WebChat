import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Group from "../types/Group";

const initGroups: { [index: string]: Group | undefined | null } = {};

const groupsSlice = createSlice({
  name: "Groups",
  initialState: initGroups,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      action.payload.forEach((group) => (state[group.groupId] = group));
    },
    setGroup: (state, action: PayloadAction<Group>) => {
      state[action.payload.groupId] = action.payload;
    },
    setNotFoundGroup: (state, action: PayloadAction<string>) => {
      state[action.payload] = null;
    },
  },
});

export const { setGroups, setGroup, setNotFoundGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
