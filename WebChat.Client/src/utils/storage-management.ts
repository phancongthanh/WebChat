import LoginSession from "../types/LoginSession";
import { PhoneNumber } from "../types/PhoneNumber";

export default class StorageManagement {
  storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }
  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
  get(key: string): string | null {
    return this.storage.getItem(key);
  }
  clear() {
    this.storage.clear();
  }
  setPhone(phone: PhoneNumber) {
    this.storage.setItem("phone", JSON.stringify(phone));
  }
  getPhone(): PhoneNumber | null {
    const phone = this.storage.getItem("phone");
    if (!phone) return null;
    return JSON.parse(phone) as PhoneNumber;
  }
  setLoginSession(session: LoginSession) {
    this.storage.setItem("userId", session.userId);
    this.storage.setItem("accessToken", session.accessToken);
    this.storage.setItem("loginSession", JSON.stringify(session));
  }
  getLoginSession() {
    const response = this.storage.getItem("loginSession");
    if (!response) return null;
    try {
      const result = JSON.parse(response) as LoginSession;
      result.expiresTime = new Date(result.expiresTime);
      return result;
    } catch (e) {
      return null;
    }
  }
  getUserId() {
    return this.storage.getItem("userId");
  }
  getAccessToken() {
    return this.storage.getItem("accessToken");
  }

  getLanguage() {
    return this.storage.getItem("language");
  }

  setLanguage(language: string) {
    this.storage.setItem("language", language);
  }
}

export const storage = new StorageManagement(sessionStorage);
