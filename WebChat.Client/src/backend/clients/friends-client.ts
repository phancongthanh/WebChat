import User from "../../types/User";
import { FriendsApiInterface } from "../openapi";
import UsersClient from "./users-client";

export default class FriendsClient {
  friends: FriendsApiInterface;
  constructor(friends: FriendsApiInterface) {
    this.friends = friends;
  }

  async getList(): Promise<User[]> {
    const response = await this.friends.apiFriendsGet();
    const dtos = response.data;
    if (!dtos) return [];

    const users = dtos.map((dto) => UsersClient.convertUser(dto));
    return users;
  }

  async startFriendship(friendId: string): Promise<void> {
    await this.friends.apiFriendsPost(friendId);
  }

  async updateFriendInfo(friendInfo: {
    userId: string;
    friendId: string;
    friendAlias: string | null;
    isBlock: boolean;
  }): Promise<void> {
    await this.friends.apiFriendsPut({
      ...friendInfo,
      currentUserId: friendInfo.userId,
    });
  }

  async sendFriendRequest(friendId: string, request: { title: string; description: string }): Promise<void> {
    await this.friends.apiFriendsFriendIdRequestsPost(friendId, {
      ...request,
      sendTime: new Date().toJSON(),
    });
  }

  async cancelFriendRequest(friendId: string): Promise<void> {
    await this.friends.apiFriendsFriendIdRequestsDelete(friendId);
  }
}
