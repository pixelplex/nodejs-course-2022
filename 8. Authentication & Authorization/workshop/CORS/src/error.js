module.exports = class AppError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.statusCode = code;
  }
};
