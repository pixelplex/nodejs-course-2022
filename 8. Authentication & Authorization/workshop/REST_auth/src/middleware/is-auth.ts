import { AppError } from '@errors';
import { JWT_SECRET } from '@auth';
import { NextFunction, Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';

export function isAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) throw new AppError('Authorization header is missing', 400);

    const [, token] = authHeader.split(' '); // 'Bearer {{token}}'

    const verifiedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { userId: number };

    req.userId = verifiedToken.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      return next(new AppError('Invalid authorization token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Authorization token expired', 401));
    }
    next(error);
  }
}
