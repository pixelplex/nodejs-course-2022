import { isAppError } from '@errors';
import { NextFunction, Request, Response } from 'express';

export const processError = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (isAppError(error)) {
    const { message, statusCode } = error;
    res.status(statusCode).json({ message, statusCode });
    return;
  }
  console.error(error);
  res.status(500).json({ message: 'Server error', statusCode: 500 });
};
