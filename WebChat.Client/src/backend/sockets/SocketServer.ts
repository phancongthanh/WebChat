export default interface SocketServer {
  sendTextMessage(conversationId: string, text: string): Promise<void>;
  receiveMessage(conversationId: string, messageId: number): Promise<void>;
  readMessage(conversationId: string, messageId: number): Promise<void>;
  checkOnline(userId: string): Promise<Date | null>;
}
