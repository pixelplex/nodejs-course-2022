export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
