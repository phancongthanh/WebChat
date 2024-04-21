import { MessageStatus } from "../../enums/MessageStatus";
import { ConversationMember, Message } from "../../types/Conversation";
import { FriendRequest } from "../../types/User";

export default interface SocketClient {
  // Friend
  sendFriendRequest: (friendId: string, request: FriendRequest) => Promise<void> | void;
  acceptFriendRequest: (friendId: string) => Promise<void> | void;
  updateFriend: (friendId: string) => Promise<void> | void;
  // Group
  updateGroup: (groupId: string) => Promise<void> | void;
  deleteGroup: (groupId: string) => Promise<void> | void;
  // Conversation
  updateConversationMember: (member: ConversationMember) => Promise<void> | void;
  addMessage: (message: Message) => Promise<void> | void;
  updateMessageStatus: (conversationId: string, messageId: number, status: MessageStatus) => Promise<void> | void;
  deleteMessage: (conversationId: string, messageId: number) => Promise<void> | void;
}
