import { Gender } from "../../enums/Gender";
import LoginSession from "../../types/LoginSession";
import { PhoneNumber } from "../../types/PhoneNumber";
import { AuthApiInterface } from "../openapi";

export default class AuthClient {
  auth: AuthApiInterface;
  constructor(auth: AuthApiInterface) {
    this.auth = auth;
  }

  async signUp(request: {
    phone: PhoneNumber;
    password: string;
    name: string;
    gender: Gender;
    birthday: Date;
  }): Promise<void> {
    await this.auth.apiAuthSignUpPost({
      countryCode: request.phone.countryCode.toString(),
      phoneNumber: request.phone.subcriberNumber.toString(),
      password: request.password,
      name: request.name,
      gender: request.gender,
      birthday: request.birthday.toJSON(),
    });
  }

  async login(phone: PhoneNumber, password: string): Promise<LoginSession> {
    const response = await this.auth.apiAuthLoginPost({
      country: phone.countryCode.toString(),
      phone: phone.subcriberNumber.toString(),
      password,
    });
    const data = response.data;
    const loginSession = {
      userId: data.userId,
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
      expiresTime: new Date(data.expiresTime),
    };
    return loginSession;
  }

  async changePassword(phone: PhoneNumber, oldPassword: string, newPassword: string): Promise<void> {
    await this.auth.apiAuthChangePasswordPut({
      country: phone.countryCode.toString(),
      phone: phone.subcriberNumber.toString(),
      oldPassword,
      newPassword,
    });
  }

  async logOut(refreshToken: string): Promise<void> {
    await this.auth.apiAuthLogOutDelete(refreshToken);
  }

  async getAccessToken(accessToken: string, refreshToken: string): Promise<LoginSession> {
    const response = await this.auth.apiAuthAccessTokenGet(refreshToken, accessToken);
    const data = response.data;
    const loginSession = {
      userId: data.userId,
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
      expiresTime: new Date(data.expiresTime),
    };
    return loginSession;
  }
}
