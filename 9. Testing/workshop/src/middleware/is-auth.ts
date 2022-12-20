import { AppError } from '@errors';
import { NextFunction, Request, Response } from 'express';
import { config } from 'config';

import * as jwt from 'jsonwebtoken';

export function isAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new AppError('Authorization header is missing', 400);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Invalid authorization header', 400);
    }

    const token = authHeader.substring(7, authHeader.length);

    if (!token) {
      throw new AppError('Invalid authorization header', 400);
    }

    const verifiedToken = jwt.verify(token, config.DEV.JWT_SECRET) as jwt.JwtPayload & { userId: number };

    req.userId = verifiedToken.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'jwt malformed') {
      return next(new AppError('Invalid authorization token', 400));
    }
    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      return next(new AppError('Invalid authorization token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Authorization token expired', 401));
    }
    next(error);
  }
}
