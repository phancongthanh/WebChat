import { Gender } from "../enums/Gender";
import { PhoneNumber } from "./PhoneNumber";

export interface FriendRequest {
  title: string;
  description: string;
  sendTime: Date;
}

export default interface User {
  userId: string;
  avatar: boolean;
  name: string;
  gender: Gender;
  birthday: Date;
  alias: string | null;
  phone: PhoneNumber | null;
  blocked: boolean;
  beBlocked: boolean;
  isFriend: boolean;
  conversationId: string | null;

  requestOfUser: FriendRequest | null;
  requestOfFriend: FriendRequest | null;

  lastAccessTime?: Date;
}
