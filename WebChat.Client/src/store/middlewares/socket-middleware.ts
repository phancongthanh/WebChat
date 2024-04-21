import { createAction, createListenerMiddleware } from "@reduxjs/toolkit";
import { MessageStatus } from "../../enums/MessageStatus";
import { ConversationMember, Message } from "../../types/Conversation";
import { conversationsClient, groupsClient, socket, usersClient } from "../../backend";
import { RootState } from "..";
import {
  addMessage,
  setConversation,
  setNotFoundConversation,
  updateMember,
  updateMessage,
} from "../conversationsSlice";
import { setGroup, setNotFoundGroup } from "../groupsSlice";
import { setOnline, setUser } from "../usersSlice";

const socketActions = {
  connectWebSocket: createAction("socket/start", () => ({
    payload: undefined,
    meta: {
      socket: true,
    },
  })),
  sendTextMessage: createAction("socket/send", (action: { conversationId: string; message: string }) => ({
    meta: {
      socket: true,
    },
    payload: action,
  })),
  readMessage: createAction("socket/checkOnline", (conversationId: string) => ({
    meta: {
      socket: true,
    },
    payload: conversationId,
  })),
  checkOnline: createAction("socket/checkOnline", (userId: string) => ({
    meta: {
      socket: true,
    },
    payload: userId,
  })),
};

const socketMiddleware = createListenerMiddleware();

socketMiddleware.startListening({
  actionCreator: socketActions.connectWebSocket,
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();
    socket.setSocketClient({
      sendFriendRequest: async (friendId) => {
        const user = await usersClient.get(friendId);
        if (user) listenerApi.dispatch(setUser(user));
      },
      acceptFriendRequest: async (friendId: string) => {
        const user = await usersClient.get(friendId);
        if (user) listenerApi.dispatch(setUser(user));
      },
      updateFriend: async (friendId: string) => {
        const user = await usersClient.get(friendId);
        if (user) listenerApi.dispatch(setUser(user));
      },
      updateGroup: async (groupId: string) => {
        const group = await groupsClient.get(groupId);
        if (group) {
          listenerApi.dispatch(setGroup(group));
          const state = listenerApi.getState() as RootState;
          const userId = state.auth.userId;
          let conversation = state.conversations[group.conversationId];
          if (conversation && !group.members.some((m) => m.userId === userId))
            listenerApi.dispatch(setNotFoundConversation(group.conversationId));
          else if (!conversation && group.members.some((m) => m.userId === userId)) {
            conversation = await conversationsClient.get(group.conversationId);
            if (conversation) listenerApi.dispatch(setConversation(conversation));
          }
        }
      },
      deleteGroup: (groupId: string) => {
        const state = listenerApi.getState() as RootState;
        const group = state.groups[groupId];
        const conversationId = group?.conversationId;
        listenerApi.dispatch(setNotFoundGroup(groupId));
        if (conversationId) listenerApi.dispatch(setNotFoundConversation(conversationId));
      },
      updateConversationMember: (member: ConversationMember) => {
        listenerApi.dispatch(updateMember(member));
      },
      addMessage: (message: Message) => {
        message.sendTime = new Date(message.sendTime);
        message.files.forEach((f) => (f.createdDate = new Date(f.createdDate)));
        listenerApi.dispatch(addMessage(message));
        const state = listenerApi.getState() as RootState;
        const conversation = state.conversations[message.conversationId];
        if (conversation && conversation.receivedToId < message.messageId) {
          socket.getSocketServer().receiveMessage(message.conversationId, message.messageId);
        }
      },
      updateMessageStatus: (conversationId: string, messageId: number, status: MessageStatus) => {
        const state = listenerApi.getState() as RootState;
        const conversation = state.conversations[conversationId];
        if (!conversation) return;
        const message = conversation.messages.find((m) => m.messageId === messageId);
        if (!message) return;
        listenerApi.dispatch(updateMessage({ ...message, status }));
      },
      deleteMessage: (conversationId: string, messageId: number) => {
        const state = listenerApi.getState() as RootState;
        const conversation = state.conversations[conversationId];
        if (!conversation) return;
        const message = conversation.messages.find((m) => m.messageId === messageId);
        if (!message) return;
        listenerApi.dispatch(updateMessage({ ...message, isDeleted: true }));
      },
    });
    socket.start();
  },
});

socketMiddleware.startListening({
  actionCreator: socketActions.sendTextMessage,
  effect: async (action, listenerApi) => {
    if (!socket.isStarted()) return;
    listenerApi.cancelActiveListeners();
    const { conversationId, message } = action.payload;
    await socket.getSocketServer().sendTextMessage(conversationId, message);
  },
});

socketMiddleware.startListening({
  actionCreator: socketActions.checkOnline,
  effect: async (action, listenerApi) => {
    if (!socket.isStarted()) return;
    listenerApi.cancelActiveListeners();
    const userId = action.payload;
    const state = listenerApi.getState() as RootState;
    const user = state.users[userId];

    if (user && !user.lastAccessTime) {
      const time = await socket.getSocketServer().checkOnline(userId);
      if (time) listenerApi.dispatch(setOnline({ userId, time }));
    }
  },
});

socketMiddleware.startListening({
  actionCreator: socketActions.readMessage,
  effect: async (action, listenerApi) => {
    if (!socket.isStarted()) return;
    listenerApi.cancelActiveListeners();
    const state = listenerApi.getState() as RootState;
    // Seen message
    const conversationId = action.payload;
    const conversation = state.conversations[conversationId];
    if (!conversation) return;
    const lastMessageId = Math.max(...conversation.messages.map((m) => m.messageId));
    if (conversation.seenToId < lastMessageId)
      await socket.getSocketServer().readMessage(conversationId, lastMessageId);
  },
});

export const { connectWebSocket, sendTextMessage, checkOnline, readMessage } = socketActions;
export default socketMiddleware.middleware;
