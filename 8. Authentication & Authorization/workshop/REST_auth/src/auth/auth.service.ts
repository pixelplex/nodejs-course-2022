import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UsersRepository } from '@users';
import { AppError } from '@errors';
import { JWT_SECRET } from './auth.constants';

class AuthService {
  async signUp(email: string, password: string, name: string): Promise<void> {
    const conflict = await UsersRepository.findByEmail(email);

    if (conflict) {
      throw new AppError('Email taken', 422);
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await UsersRepository.create(email, hashedPassword, name);
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await UsersRepository.findByEmail(email);
    const authError = new AppError('Authentication failed. Check your email/password.', 401);

    if (!user) {
      throw authError;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw authError;
    }

    return { token: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }) };
  }
}

export const authService = new AuthService();
