import * as express from 'express';
import { Application } from 'express';

import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { validatePayload } from '@middleware';

const router = express.Router();

router.post('/signup', ...AuthValidation.signup, validatePayload, AuthController.signUpPOST);
router.post('/login', ...AuthValidation.login, validatePayload, AuthController.loginPOST);

export function mountRouter(app: Application): void {
  app.use('/auth', router);
}
