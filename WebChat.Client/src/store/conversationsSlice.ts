import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MessageStatus } from "../enums/MessageStatus";
import Conversation, { ConversationMember, Message } from "../types/Conversation";

const initConversations: { [index: string]: Conversation | undefined | null } = {};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: initConversations,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      action.payload.forEach((conversation) => (state[conversation.conversationId] = conversation));
    },
    setConversation: (state, action: PayloadAction<Conversation>) => {
      state[action.payload.conversationId] = action.payload;
    },
    setNotFoundConversation: (state, action: PayloadAction<string>) => {
      state[action.payload] = null;
    },
    updateMember: (state, action: PayloadAction<ConversationMember>) => {
      const member = action.payload;
      const conversation = state[member.conversationId];
      if (conversation) {
        const lastMessageId = conversation.messages[conversation.messages.length - 1]?.messageId || 0;
        state[member.conversationId] = {
          ...conversation,
          ...member,
          status:
            member.seenToId >= lastMessageId
              ? MessageStatus.Seen
              : member.receivedToId >= lastMessageId
                ? MessageStatus.Received
                : MessageStatus.Sent,
          messages: member.loadFromId <= lastMessageId ? conversation.messages : [],
        };
      }
    },
    addMessages: (state, action: PayloadAction<Message[]>) => {
      const messages = action.payload;
      if (!messages.length) return;
      const conversationId = messages[0].conversationId;
      const conversation = state[conversationId];
      if (conversation) {
        conversation.messages = [...conversation.messages, ...messages].sort(
          (a, b) => a.sendTime.getTime() - b.sendTime.getTime(),
        );
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const conversation = state[message.conversationId];
      if (conversation) {
        conversation.messages = [...conversation.messages, message];
      }
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const conversation = state[message.conversationId];
      if (conversation) {
        conversation.messages = conversation.messages.map((m) => (m.messageId !== message.messageId ? m : message));
      }
    },
    deleteMessage: (state, action: PayloadAction<Message>) => {
      const conversation = state[action.payload.conversationId];
      if (conversation) {
        conversation.messages = conversation.messages.filter((m) => m.messageId !== action.payload.messageId);
      }
    },
  },
});

export const {
  setConversations,
  setConversation,
  setNotFoundConversation,
  updateMember,
  addMessage,
  addMessages,
  updateMessage,
  deleteMessage,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
