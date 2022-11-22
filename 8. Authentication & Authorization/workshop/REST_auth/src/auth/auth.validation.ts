import { body } from 'express-validator';

export class AuthValidation {
  static signup = [
    body('email').isString().trim().isEmail(),
    body('password').isString().trim().isLength({ min: 5 }),
    body('name').isString().trim().isLength({ min: 1 }),
  ];

  static login = [body('email').isString().trim().isEmail(), body('password').isString().trim().isLength({ min: 5 })];
}
