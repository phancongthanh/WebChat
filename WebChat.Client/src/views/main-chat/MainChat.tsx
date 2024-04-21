import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { readMessage } from "../../store/middlewares/socket-middleware";
import useConversation from "../../hooks/useConversation";
import { loadMessages, sendMessage } from "../../thunks/conversationThunk";
import ActiveComponent from "../../components/ActiveComponent";
import ChatGuide from "./ChatGuide";
import MessageContainer from "./MessageContainer";
import MessageList from "./MessageList";
import ChatBar from "./chat-bar/ChatBar";

export default function MainChat({ conversationId }: { conversationId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const conversation = useConversation(conversationId);
  const messages = useMemo(
    () => conversation?.messages.filter((m) => !conversation?.hiddenMessageIds.includes(m.messageId)) || [],
    [conversation?.messages, conversation?.hiddenMessageIds],
  );

  useEffect(() => {
    if (!conversation || !conversation.messages.length) return;
    const lastMessageId = Math.max(...conversation.messages.map((m) => m.messageId));
    if (conversation.seenToId < lastMessageId) dispatch(readMessage(conversation.conversationId));
  }, [conversation, dispatch]);

  const handleSend = useCallback(
    async (text: string, files: File[]) => await dispatch(sendMessage({ conversationId, text, files })).unwrap,
    [conversationId, dispatch],
  );
  const handleLoadMessages = useCallback(
    async () => await dispatch(loadMessages(conversationId)).unwrap(),
    [conversationId, dispatch],
  );

  return (
    <ActiveComponent condition={conversation}>
      <MessageContainer length={messages.length} onLoad={handleLoadMessages}>
        <ChatGuide />
        <MessageList messages={messages} />
      </MessageContainer>
      <ActiveComponent condition={!conversation?.isBlock}>
        <ChatBar onSend={handleSend} />
      </ActiveComponent>
    </ActiveComponent>
  );
}
