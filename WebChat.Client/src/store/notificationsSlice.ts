import { ReactNode } from "react";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
  id: number | string;
  severity: "error" | "info" | "success" | "warning";
  title?: string;
  message: string;
  closeButton?: ReactNode;
  onClose?: () => void;
}

const initNotifications: Array<NotificationState> = [];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initNotifications,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationState>) => [action.payload, ...state],
    removeNotification: (state, action: PayloadAction<number | string>) => state.filter((n) => n.id !== action.payload),
    clearNotification: () => [],
  },
});

export const { addNotification, removeNotification, clearNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
