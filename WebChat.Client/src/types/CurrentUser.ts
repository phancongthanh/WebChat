import { Gender } from "../enums/Gender";
import { PhoneNumber } from "./PhoneNumber";

export default interface CurrentUser {
  userId: string;
  name: string;
  gender: Gender;
  birthday: Date;
  phone: PhoneNumber;
  conversationId: string;
}
