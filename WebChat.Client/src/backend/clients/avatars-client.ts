import { Configuration } from "../openapi";
import { AvatarsApiAxiosParamCreator, AvatarsApiInterface } from "../openapi";

export default class AvatarsClient {
  configuration?: Configuration;
  avatars: AvatarsApiInterface;
  constructor(avatars: AvatarsApiInterface, configuration?: Configuration) {
    this.avatars = avatars;
    this.configuration = configuration;
  }

  async getUserUrl(userId: string): Promise<string> {
    const requestArgs = await AvatarsApiAxiosParamCreator(this.configuration).apiAvatarsUserUserIdGet(userId);
    return requestArgs.url;
  }

  async getUser(userId: string): Promise<File | null> {
    try {
      const response = await this.avatars.apiAvatarsUserUserIdGet(userId);
      const avatar = response.data;
      return avatar;
    } catch (e) {
      return null;
    }
  }

  async setUser(file: File): Promise<void> {
    await this.avatars.apiAvatarsUserPut(file);
  }

  async getGroupUrl(groupId: string): Promise<string> {
    const requestArgs = await AvatarsApiAxiosParamCreator(this.configuration).apiAvatarsGroupGroupIdGet(groupId);
    return requestArgs.url;
  }

  async getGroup(groupId: string): Promise<File | null> {
    try {
      const response = await this.avatars.apiAvatarsGroupGroupIdGet(groupId);
      const avatar = response.data;
      return avatar;
    } catch (e) {
      return null;
    }
  }
}
