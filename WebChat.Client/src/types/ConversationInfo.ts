import { ConversationType } from "../enums/ConversationType";

export default interface ConversationInfo {
  type: ConversationType;
  id: string; // id = cloudId || friendId || groupId
  cloudId: string | null; // Id of user
  friendId: string | null; // Id of friend
  groupId: string | null; // Id of group
  conversationId: string | null; // Id of conversation
}
