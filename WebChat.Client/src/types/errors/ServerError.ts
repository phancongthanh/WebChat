import ApiError from "./ApiError";

export default class ServerError extends ApiError {
  protected isServerError = true;
  static isServerError(obj?: unknown): obj is ServerError {
    return (obj as ServerError)?.isServerError === true;
  }
}
