import ApiError from "./ApiError";

export default class ConnectionError extends ApiError {
  protected isConnectionError = true;
  static isConnectionError(obj?: unknown): obj is ConnectionError {
    return (obj as ConnectionError)?.isConnectionError === true;
  }
}
