export default class ApiError extends Error {
  protected isApiError = true;

  static isApiError(obj?: unknown): obj is ApiError {
    return (obj as ApiError)?.isApiError === true;
  }
}
