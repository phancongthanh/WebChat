import { Divider } from "@mui/material";
import { Message } from "../../types/Conversation";
import ChatMessage from "./chat-message/ChatMessage";

export default function MessageList({ messages }: { messages: Message[] }) {
  const content = [];
  for (let i = 0; i < messages.length; i++) {
    const prevTime = messages[i - 1]?.sendTime || new Date(0);
    const message = messages[i];
    if (message.sendTime.getTime() - prevTime.getTime() > 30 * 60 * 1000) {
      const time = message.sendTime.toLocaleString();
      content.push(
        <Divider key={time} className="text-sm m-0" variant="middle">
          {time}
        </Divider>,
      );
    }
    content.push(
      <ChatMessage
        key={message.messageId}
        message={message}
        isBreak={message.fromUserId !== messages[i - 1]?.fromUserId}
      />,
    );
  }
  return content;
}
