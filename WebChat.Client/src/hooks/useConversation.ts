import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Conversation from "../types/Conversation";
import { conversationsClient } from "../backend";
import { AppDispatch, RootState } from "../store";
import { setConversation, setNotFoundConversation } from "../store/conversationsSlice";

export default function useConversation(conversationId: string): Conversation | null {
  // Get conversation data from store
  const conversation = useSelector<RootState, Conversation | null | undefined>(
    (state) => state.conversations[conversationId],
  );
  // Get dispatch function
  const dispatch = useDispatch<AppDispatch>();
  // Load conversation data from backend if conversation is undefined
  useEffect(() => {
    if (conversation === undefined) {
      conversationsClient
        .get(conversationId)
        .then((u) => u && dispatch(setConversation(u)))
        .catch(() => dispatch(setNotFoundConversation(conversationId)));
    }
  }, [conversationId, conversation, dispatch]);
  // Return conversation data
  return conversation || null;
}
