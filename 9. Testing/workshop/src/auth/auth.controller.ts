import { NextFunction, Request, Response } from 'express';

import { authService } from './auth.service';

export class AuthController {
  static signUpPOST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      await authService.signUp(email, password, name);

      res.status(201).json({
        message: 'User has been created',
      });
    } catch (error) {
      next(error);
    }
  };

  static loginPOST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { token } = await authService.login(email, password);
      res.status(200).json({
        token,
      });
    } catch (error) {
      next(error);
    }
  };
}
