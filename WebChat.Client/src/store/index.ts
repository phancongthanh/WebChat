import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// import logger from "redux-logger";
import conversationsReducer from "./conversationsSlice";
import errorReducer from "./errorSlice";
import groupsReducer from "./groupsSlice";
import socket from "./middlewares/socket-middleware";
import notificationsReducer from "./notificationsSlice";
import systemReducer from "./systemSlice";
import usersReducer from "./usersSlice";

const store = configureStore({
  reducer: combineReducers({
    system: systemReducer,
    error: errorReducer,
    auth: authReducer,
    users: usersReducer,
    groups: groupsReducer,
    conversations: conversationsReducer,
    notifications: notificationsReducer,
  }),
  middleware: (gDM) => gDM({ serializableCheck: false }).concat(socket),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
