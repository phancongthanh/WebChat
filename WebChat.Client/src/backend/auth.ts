import { JwtPayload, jwtDecode } from "jwt-decode";
import { Gender } from "../enums/Gender";
import LoginSession from "../types/LoginSession";
import { PhoneNumber } from "../types/PhoneNumber";
import UnauthorizedError from "../types/errors/UnauthorizedError";
import { storage } from "../utils/storage-management";
import axiosClient from "./axios";
import AuthClient from "./clients/auth-client";
import { AuthApi } from "./openapi";

export class AuthService {
  auths: AuthClient;
  constructor(auths: AuthClient) {
    this.auths = auths;
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  async signUp(request: {
    phone: PhoneNumber;
    password: string;
    name: string;
    gender: Gender;
    birthday: Date;
  }): Promise<void> {
    await this.auths.signUp(request);
    await this.login(request.phone, request.password);
    const params = new URL(window.location.toString()).searchParams;
    const returnUrl = params.get("returnUrl");
    if (returnUrl) window.location.replace(returnUrl);
    else window.location.reload();
  }

  async login(phone: PhoneNumber, password: string): Promise<LoginSession> {
    const loginSession = await this.auths.login(phone, password);
    if (loginSession.userId !== storage.getUserId()) storage.clear();
    storage.setLoginSession(loginSession);
    storage.setPhone(phone);
    return loginSession;
  }

  async logOut(): Promise<void> {
    const loginSession = storage.getLoginSession();
    if (loginSession) {
      await this.auths.logOut(loginSession.refreshToken);
    }
    storage.clear();
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const phone = storage.getPhone();
    if (!phone) return;
    await this.auths.changePassword(phone, oldPassword, newPassword);
  }

  async getAccessToken(): Promise<string> {
    const accessToken = storage.getAccessToken();
    if (!accessToken) throw new UnauthorizedError();
    const token = jwtDecode<JwtPayload>(accessToken);
    if (token.exp && new Date(token.exp * 1000) > new Date()) return accessToken;

    const loginSession = storage.getLoginSession();
    if (!loginSession) throw new UnauthorizedError();
    const expires = loginSession.expiresTime;
    const refreshToken = loginSession.refreshToken;
    if (new Date(expires) > new Date()) {
      const loginSession = await this.auths.getAccessToken(accessToken, refreshToken);
      storage.setLoginSession(loginSession);
      return loginSession.accessToken;
    } else throw new UnauthorizedError(loginSession);
  }

  logged(): boolean {
    const loginSession = storage.getLoginSession();
    if (!loginSession || !loginSession.expiresTime) return false;

    return new Date(loginSession.expiresTime) > new Date();
  }

  async checkLogged(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      return accessToken ? true : false;
    } catch (e) {
      return false;
    }
  }
}

const basePath = "";
const authApi = new AuthApi(undefined, basePath, axiosClient);
export const authClient = new AuthClient(authApi);
export const auth = new AuthService(authClient);

export default auth;
