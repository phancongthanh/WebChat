import LoginSession from "../LoginSession";

export default class UnauthorizedError extends Error {
  session?: LoginSession;
  protected isUnauthorizedError = true;

  static isUnauthorizedError(obj?: unknown): obj is UnauthorizedError {
    return (obj as UnauthorizedError)?.isUnauthorizedError === true;
  }

  constructor(session?: LoginSession) {
    super();
    this.session = session;
  }
}
