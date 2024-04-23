import { PhoneNumber } from "./PhoneNumber";

export interface SystemInfo {
  version: string;
  appName: string;
  adminPhone: PhoneNumber;
  email: string;
  globalGroupCode: string;
  maxFileSize: number;
  maxFileCountPerMessage: number;
}
