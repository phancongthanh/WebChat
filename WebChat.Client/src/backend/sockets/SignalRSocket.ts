import * as SignalR from "@microsoft/signalr";
import SocketClient from "./SocketClient";
import SocketServer from "./SocketServer";

export default class SignalRSocket {
  private connection: SignalR.HubConnection;
  private server: SocketServer;

  constructor(link: string, accessTokenFactory: () => string | Promise<string>) {
    const connectionHub = link;

    const protocol = new SignalR.JsonHubProtocol();

    const options = {
      logMessageContent: true,
      logger: SignalR.LogLevel.Information,
      accessTokenFactory: accessTokenFactory,
    };

    // create the connection instance
    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl(connectionHub, options)
      .withHubProtocol(protocol)
      .withAutomaticReconnect()
      .build();

    this.server = {
      sendTextMessage: (conversationId: string, text: string) =>
        this.connection.send("SendTextMessage", conversationId, text),
      receiveMessage: (conversationId: string, messageId: number) =>
        this.connection.send("ReceiveMessage", conversationId, messageId),
      readMessage: (conversationId: string, messageId: number) =>
        this.connection.send("ReadMessage", conversationId, messageId),
      checkOnline: async (userId: string) => {
        const result = await this.connection.invoke<string | null | undefined>("CheckOnline", userId);
        if (!result) return null;
        return new Date(result);
      },
    };
  }

  start() {
    if (this.connection.state === SignalR.HubConnectionState.Disconnected)
      this.connection
        .start()
        .then(() => console.log("Socket connected!"))
        .catch((error) => console.error(error));
  }

  isStarted() {
    return this.connection.state === SignalR.HubConnectionState.Connected;
  }

  close() {
    if (this.isStarted()) this.connection.stop();
  }

  getSocketServer(): SocketServer {
    return this.server;
  }

  setSocketClient(client: SocketClient) {
    // this.connection.on("sendFriendRequest", client.sendFriendRequest);
    // this.connection.on("acceptFriendRequest", client.acceptFriendRequest);
    // this.connection.on("updateFriend", client.updateFriend);
    Object.keys(client).forEach((key) =>
      this.connection.on(key, (client as unknown as { [x: string]: (...args: unknown[]) => unknown })[key]),
    );
  }
}
