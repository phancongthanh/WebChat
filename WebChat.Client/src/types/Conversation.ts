import { ConversationType } from "../enums/ConversationType";
import { MessageStatus } from "../enums/MessageStatus";
import FileMetadata from "./FileMetadata";

export interface ConversationMember {
  conversationId: string;
  userId: string;
  isHidden: boolean;
  receivedToId: number;
  seenToId: number;
  loadFromId: number;
  hiddenMessageIds: Array<number>;
  isBlock: boolean;
}

export interface Message {
  isDeleted: boolean;
  messageId: number;
  conversationId: string;
  fromUserId: string;
  sendTime: Date;
  text: string;
  status: MessageStatus;
  files: Array<FileMetadata>;
}

export default interface Conversation {
  type: ConversationType;
  conversationId: string;
  isHidden: boolean;
  receivedToId: number;
  seenToId: number;
  loadFromId: number;
  messages: Array<Message>;
  hiddenMessageIds: Array<number>;
  isBlock: boolean;
  status: MessageStatus;
}
