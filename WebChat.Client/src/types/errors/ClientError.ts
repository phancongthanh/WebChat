import ApiError from "./ApiError";

export default class ClientError extends ApiError {
  status: number;
  headers: { [key: string]: unknown };
  body?: unknown;
  title: string;
  description: string;
  details: { [key: string]: string[] };

  constructor(
    status: number,
    headers: { [key: string]: unknown },
    body: unknown | undefined,
    title: string,
    description: string,
    details: { [key: string]: string[] },
  ) {
    super();
    this.status = status;
    this.headers = headers;
    this.body = body;
    this.title = title;
    this.description = description;
    this.details = details;
  }

  protected isClientError = true;

  static isClientError(obj?: unknown): obj is ClientError {
    return (obj as ClientError)?.isClientError === true;
  }
}
