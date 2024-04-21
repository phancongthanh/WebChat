import { Gender } from "../../enums/Gender";
import CurrentUser from "../../types/CurrentUser";
import { PhoneNumber } from "../../types/PhoneNumber";
import User from "../../types/User";
import { UserInfo, UsersApiInterface } from "../openapi";

export default class UsersClient {
  users: UsersApiInterface;
  constructor(users: UsersApiInterface) {
    this.users = users;
  }

  async getCurrent(): Promise<CurrentUser> {
    const response = await this.users.apiUsersCurrentGet();
    const dto = response.data;

    const user: CurrentUser = {
      userId: dto.userId,
      name: dto.name,
      gender: dto.gender,
      birthday: new Date(dto.birthday),
      phone: new PhoneNumber(dto.phoneNumber.countryCode, dto.phoneNumber.subscriberNumber),
      conversationId: dto.conversationId,
    };

    return user;
  }

  static convertUser(dto: UserInfo): User {
    const user: User = {
      userId: dto.userId,
      avatar: dto.avatar,
      name: dto.name,
      gender: dto.gender,
      birthday: new Date(dto.birthday),
      phone: dto.phone ? new PhoneNumber(dto.phone.countryCode, dto.phone.subscriberNumber) : null,
      alias: dto.alias || null,
      conversationId: dto.conversationId || null,
      blocked: dto.blocked,
      beBlocked: dto.beBlocked,
      isFriend: dto.isFriend,
      requestOfUser: null,
      requestOfFriend: null,
    };
    if (dto.requestOfUser) {
      user.requestOfUser = {
        title: dto.requestOfUser.title,
        description: dto.requestOfUser.description,
        sendTime: new Date(dto.requestOfUser.sendTime),
      };
    }
    if (dto.requestOfFriend) {
      user.requestOfFriend = {
        title: dto.requestOfFriend.title,
        description: dto.requestOfFriend.description,
        sendTime: new Date(dto.requestOfFriend.sendTime),
      };
    }
    return user;
  }

  async get(userId: string): Promise<User | null> {
    const response = await this.users.apiUsersUserIdGet(userId);
    const dto = response.data;
    if (!dto) return null;
    return UsersClient.convertUser(dto);
  }

  async getList(userIds: string[]): Promise<User[]> {
    const response = await this.users.apiUsersPost(userIds);
    const dtos = response.data;
    if (!dtos) return [];

    const users = dtos.map((dto) => UsersClient.convertUser(dto));
    return users;
  }

  async getByPhone(country: string, phone: string): Promise<User | null> {
    const response = await this.users.apiUsersPhoneNumberGet(country, phone);
    const dto = response.data;
    if (!dto) return null;

    const user = UsersClient.convertUser(dto);
    return user;
  }

  async update(user: { userId: string; name: string; gender: Gender; birthday: Date }): Promise<void> {
    await this.users.apiUsersPut({
      currentUserId: user.userId,
      name: user.name,
      gender: user.gender,
      birthday: user.birthday.toJSON(),
    });
  }
}
