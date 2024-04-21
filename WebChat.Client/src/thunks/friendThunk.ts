import { createAsyncThunk } from "@reduxjs/toolkit";
import { friendsClient } from "../backend";
import { AppDispatch, RootState } from "../store";
import { showError } from "../store/errorSlice";

export const startFriendship = createAsyncThunk<boolean, string>(
  "thunk/friend/startFriendship",
  async (friendId, { dispatch }) => {
    try {
      await friendsClient.startFriendship(friendId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const sendFriendRequest = createAsyncThunk<
  boolean,
  {
    friendId: string;
    title: string;
    description: string;
  }
>("thunk/friend/sendFriendRequest", async (request, { dispatch }) => {
  try {
    await friendsClient.sendFriendRequest(request.friendId, request);
    return true;
  } catch (e) {
    dispatch(showError(e));
    return false;
  }
});

export const acceptFriendRequest = createAsyncThunk<boolean, string>(
  "thunk/friend/acceptFriendRequest",
  async (friendId, { dispatch }) => {
    try {
      await friendsClient.sendFriendRequest(friendId, {
        title: "",
        description: "",
      });
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const cancelFriendRequest = createAsyncThunk<boolean, string>(
  "thunk/friend/cancelFriendRequest",
  async (friendId, { dispatch }) => {
    try {
      await friendsClient.cancelFriendRequest(friendId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const changeBlockStatus = createAsyncThunk<
  boolean,
  { friendId: string; isBlock: boolean },
  { state: RootState; dispatch: AppDispatch }
>("thunk/friend/changeBlockStatus", async ({ friendId, isBlock }, { getState, dispatch }) => {
  const userId = getState().auth.userId;
  const friendInfo = getState().users[friendId];
  try {
    await friendsClient.updateFriendInfo({
      userId,
      friendId,
      friendAlias: friendInfo?.alias || null,
      isBlock,
    });
    return true;
  } catch (e) {
    dispatch(showError(e));
    return false;
  }
});

export const setFriendAlias = createAsyncThunk<
  boolean,
  { friendId: string; alias: string | null },
  { state: RootState; dispatch: AppDispatch }
>("thunk/friend/setFriendAlias", async ({ friendId, alias }, { getState, dispatch }) => {
  const userId = getState().auth.userId;
  const friendInfo = getState().users[friendId];
  try {
    await friendsClient.updateFriendInfo({
      userId,
      friendId,
      isBlock: friendInfo?.blocked || false,
      friendAlias: alias,
    });
    return true;
  } catch (e) {
    dispatch(showError(e));
    return false;
  }
});
