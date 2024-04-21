import Conversation, { Message } from "../../types/Conversation";
import { ConversationInfo as ConversationDto, ConversationsApiInterface } from "../openapi";

export default class ConversationsClient {
  conversations: ConversationsApiInterface;
  constructor(conversations: ConversationsApiInterface) {
    this.conversations = conversations;
  }

  static convertConversation(dto: ConversationDto): Conversation {
    return {
      type: dto.type,
      conversationId: dto.conversationId,
      isHidden: dto.isHidden,
      receivedToId: dto.receivedToId,
      seenToId: dto.seenToId,
      loadFromId: dto.loadFromId,
      messages: dto.messages.map((m) => ({
        conversationId: m.conversationId,
        messageId: m.messageId,
        fromUserId: m.fromUserId,
        sendTime: new Date(m.sendTime),
        text: m.text,
        status: m.status,
        files: m.files.map((f) => ({ ...f, createdDate: new Date(f.createdDate) })),
        isDeleted: m.isDeleted,
      })),
      hiddenMessageIds: dto.hiddenMessageIds,
      isBlock: dto.isBlock,
      status: dto.status,
    };
  }

  async getList(): Promise<Conversation[]> {
    const response = await this.conversations.apiConversationsGet();
    const dtos = response.data;
    if (!dtos) return [];

    const users = dtos.map((dto) => ConversationsClient.convertConversation(dto));
    return users;
  }

  async get(conversationId: string): Promise<Conversation | null> {
    const response = await this.conversations.apiConversationsConversationIdGet(conversationId);
    const dto = response.data;
    if (!dto) return null;
    const group = ConversationsClient.convertConversation(dto);
    return group;
  }

  async hide(conversationId: string, isHidden: boolean): Promise<void> {
    await this.conversations.apiConversationsConversationIdHiddenPatch(conversationId, isHidden);
  }

  async delete(conversationId: string): Promise<void> {
    await this.conversations.apiConversationsConversationIdDelete(conversationId);
  }

  async sendMessage(conversationId: string, text: string, files?: File[]): Promise<number> {
    const response = await this.conversations.apiConversationsConversationIdMessagesPost(conversationId, text, files);
    const dto = response.data;
    return dto as number;
  }

  async loadMessages(conversationId: string, messageId: number, count?: number): Promise<Message[]> {
    const response = await this.conversations.apiConversationsConversationIdMessagesGet(
      conversationId,
      messageId,
      count,
    );
    const dtos = response.data;
    const messages = dtos.map((m) => ({
      conversationId: m.conversationId,
      messageId: m.messageId,
      fromUserId: m.fromUserId,
      sendTime: new Date(m.sendTime),
      text: m.text,
      status: m.status,
      files: m.files.map((f) => ({ ...f, createdDate: new Date(f.createdDate) })),
      isDeleted: m.isDeleted,
    }));
    return messages;
  }

  async hideMessage(conversationId: string, messageId: number) {
    await this.conversations.apiConversationsConversationIdMembersHiddenMessagesPatch(conversationId, messageId);
  }

  async deleteMessage(conversationId: string, messageId: number) {
    await this.conversations.apiConversationsConversationIdMessagesMessageIdDelete(conversationId, messageId);
  }

  async getFile(conversationId: string, messageId: number, path: string): Promise<File | null> {
    try {
      const response = await this.conversations.apiConversationsConversationIdMessagesMessageIdFilesPathGet(
        conversationId,
        messageId,
        path,
        {
          responseType: "blob",
        },
      );
      const file = response.data;
      return file;
    } catch (e) {
      return null;
    }
  }
}
