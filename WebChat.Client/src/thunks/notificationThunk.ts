import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationState, addNotification, removeNotification } from "../store/notificationsSlice";

export const showNotification = createAsyncThunk<
  NotificationState,
  { severity: "error" | "info" | "success" | "warning"; message: string; duration?: number }
>("thunk/notification/showNotification", async ({ severity, message, duration }, { dispatch }) => {
  const id = Math.random() * 1000;
  const notification: NotificationState = {
    id,
    severity,
    message,
  };
  dispatch(addNotification(notification));
  setTimeout(() => dispatch(removeNotification(id)), duration || 5000);
  return notification;
});
