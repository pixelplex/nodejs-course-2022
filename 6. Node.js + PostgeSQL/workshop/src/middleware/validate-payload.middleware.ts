import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validatePayload = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Bad request', statusCode: 400, errors: errors.array() });
    return;
  }
  next();
};
