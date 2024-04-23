import { createAsyncThunk } from "@reduxjs/toolkit";
import { MessageStatus } from "../enums/MessageStatus";
import { Message } from "../types/Conversation";
import { conversationsClient } from "../backend";
import { AppDispatch, RootState } from "../store";
import { addMessage, addMessages, deleteMessage } from "../store/conversationsSlice";
import { showError } from "../store/errorSlice";
import { sendTextMessage } from "../store/middlewares/socket-middleware";

export const sendMessage = createAsyncThunk<
  boolean,
  { conversationId: string; text: string; files?: File[] },
  { state: RootState; dispatch: AppDispatch }
>("thunk/conversation/sendMessage", async ({ conversationId, text, files }, { getState, dispatch }) => {
  const userId = getState().auth.userId;
  const message: Message = {
    conversationId,
    messageId: Math.random() * 1e6,
    isDeleted: false,
    fromUserId: userId,
    sendTime: new Date(),
    status: MessageStatus.Sending,
    text,
    files:
      files?.map((f) => ({
        path: "",
        name: f.name,
        size: f.size,
        contentType: f.type,
        createdDate: new Date(f.lastModified),
      })) || [],
  };
  dispatch(addMessage(message));
  try {
    if (files && files.length) await conversationsClient.sendMessage(conversationId, text, files);
    else dispatch(sendTextMessage({ conversationId, message: text }));
    return true;
  } catch (e) {
    dispatch(showError(e));
    return false;
  } finally {
    dispatch(deleteMessage(message));
  }
});

export const loadMessages = createAsyncThunk<boolean, string, { state: RootState; dispatch: AppDispatch }>(
  "thunk/conversation/loadMessages",
  async (conversationId, { getState, dispatch }) => {
    try {
      const conversation = getState().conversations[conversationId];
      if (!conversation) return false;
      const lastMessageId = Math.min(...conversation.messages.map((m) => m.messageId));
      const messages = await conversationsClient.loadMessages(conversationId, lastMessageId);
      if (!messages.length) return false;
      dispatch(addMessages(messages));
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const hideMessage = createAsyncThunk<boolean, { conversationId: string; messageId: number }>(
  "thunk/conversation/hideMessage",
  async ({ conversationId, messageId }, { dispatch }) => {
    try {
      await conversationsClient.hideMessage(conversationId, messageId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const removeMessage = createAsyncThunk<boolean, { conversationId: string; messageId: number }>(
  "thunk/conversation/removeMessage",
  async ({ conversationId, messageId }, { dispatch }) => {
    try {
      await conversationsClient.deleteMessage(conversationId, messageId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const hideConversation = createAsyncThunk<boolean, { conversationId: string; isHidden: boolean }>(
  "thunk/conversation/hideConversation",
  async ({ conversationId, isHidden }, { dispatch }) => {
    try {
      await conversationsClient.hide(conversationId, isHidden);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);

export const deleteConversation = createAsyncThunk<boolean, string>(
  "thunk/conversation/deleteConversation",
  async (conversationId, { dispatch }) => {
    try {
      await conversationsClient.delete(conversationId);
      return true;
    } catch (e) {
      dispatch(showError(e));
      return false;
    }
  },
);
