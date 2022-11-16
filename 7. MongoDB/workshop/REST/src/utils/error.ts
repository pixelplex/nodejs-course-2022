export class AppError extends Error {
  private statusCode;
  constructor(message, code = 500) {
    super(message);
    this.statusCode = code;
  }
};
