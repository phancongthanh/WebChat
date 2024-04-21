export default class AppError extends Error {
  title?: string;
  description?: string;
  details?: string[];
  link?: string;

  constructor(title?: string, description?: string, details?: string[], link?: string) {
    super();
    this.title = title;
    this.description = description;
    this.details = details;
    this.link = link;
  }
}
