export default interface LoginSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresTime: Date;
}
