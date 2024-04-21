import { createAsyncThunk } from "@reduxjs/toolkit";
import { MemberRole } from "../enums/MemberRole";
import { GroupSetting } from "../types/Group";
import { groupsClient } from "../backend";
import { RootState } from "../store";
import { showError } from "../store/errorSlice";

export const createGroup = createAsyncThunk<string | null, { name: string; userIds: string[] }>(
  "thunk/group/createGroup",
  async ({ name, userIds }, { dispatch }) => {
    try {
      const groupId = await groupsClient.create(name, userIds);
      return groupId;
    } catch (e) {
      dispatch(showError(e));
      return null;
    }
  },
);

export const updateGroupSetting = createAsyncThunk<boolean, { groupId: string; setting: GroupSetting }>(
  "thunk/group/updateGroupSetting",
  async ({ groupId, setting }, { dispatch }) => {
    try {
      await groupsClient.updateSetting(groupId, setting);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const updateGroupName = createAsyncThunk<boolean, { groupId: string; name: string }>(
  "thunk/group/updateGroupName",
  async ({ groupId, name }, { dispatch }) => {
    try {
      await groupsClient.updateName(groupId, name);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const updateMemberRole = createAsyncThunk<boolean, { groupId: string; userId: string; role: MemberRole }>(
  "thunk/group/updateMemberRole",
  async ({ groupId, userId, role }, { dispatch }) => {
    try {
      await groupsClient.updateMemberRole(groupId, userId, role);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const joinGroup = createAsyncThunk<boolean, string>("thunk/group/joinGroup", async (groupId, { dispatch }) => {
  try {
    await groupsClient.join(groupId);
    return true;
  } catch (e) {
    dispatch(showError(e));
    return false;
  }
});

export const leaveGroup = createAsyncThunk<boolean, string, { state: RootState }>(
  "thunk/group/leaveGroup",
  async (groupId, { getState, dispatch }) => {
    try {
      const userId = getState().auth.userId;
      await groupsClient.leave(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const kickGroupMember = createAsyncThunk<boolean, { groupId: string; userId: string }>(
  "thunk/group/kickGroupMember",
  async ({ groupId, userId }, { dispatch }) => {
    try {
      await groupsClient.leave(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const sendGroupRequest = createAsyncThunk<boolean, string>(
  "thunk/group/sendGroupRequest",
  async (groupId, { dispatch }) => {
    try {
      await groupsClient.sendRequest(groupId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const undoGroupRequest = createAsyncThunk<boolean, string, { state: RootState }>(
  "thunk/group/undoGroupRequest",
  async (groupId, { getState, dispatch }) => {
    try {
      const userId = getState().auth.userId;
      await groupsClient.rejectRequest(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const acceptGroupRequest = createAsyncThunk<boolean, { groupId: string; userId: string }>(
  "thunk/group/acceptGroupRequest",
  async ({ groupId, userId }, { dispatch }) => {
    try {
      await groupsClient.acceptRequest(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const rejectGroupRequest = createAsyncThunk<boolean, { groupId: string; userId: string }>(
  "thunk/group/rejectGroupRequest",
  async ({ groupId, userId }, { dispatch }) => {
    try {
      await groupsClient.rejectRequest(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const sendGroupInvitation = createAsyncThunk<boolean, { groupId: string; userIds: string[] }>(
  "thunk/group/sendGroupInvitation",
  async ({ groupId, userIds }, { dispatch }) => {
    try {
      await groupsClient.sendInvitation(groupId, userIds);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const undoGroupInvitation = createAsyncThunk<boolean, { groupId: string; userId: string }>(
  "thunk/group/undoGroupInvitation",
  async ({ groupId, userId }, { dispatch }) => {
    try {
      await groupsClient.rejectInvitation(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const acceptGroupInvitation = createAsyncThunk<boolean, string, { state: RootState }>(
  "thunk/group/acceptGroupInvitation",
  async (groupId, { getState, dispatch }) => {
    try {
      const userId = getState().auth.userId;
      await groupsClient.acceptInvitation(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const rejectGroupInvitation = createAsyncThunk<boolean, string, { state: RootState }>(
  "thunk/group/rejectGroupInvitation",
  async (groupId, { getState, dispatch }) => {
    try {
      const userId = getState().auth.userId;
      await groupsClient.rejectInvitation(groupId, userId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);
