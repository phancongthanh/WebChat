import { PhoneNumber } from "../../types/PhoneNumber";
import { SystemInfo } from "../../types/SystemInfo";
import { SystemInfoApiInterface } from "../openapi";

export default class SystemClient {
  system: SystemInfoApiInterface;
  constructor(system: SystemInfoApiInterface) {
    this.system = system;
  }

  async getInfo(): Promise<SystemInfo> {
    const response = await this.system.apiSystemInfoGet();
    const dto = response.data;
    const info: SystemInfo = {
      ...dto,
      adminPhone: new PhoneNumber(dto.adminPhone.countryCode, dto.adminPhone.subscriberNumber),
    };
    return info;
  }
}
