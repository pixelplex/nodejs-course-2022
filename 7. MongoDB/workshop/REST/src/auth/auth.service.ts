import * as bcrypt from 'bcrypt';

import { IUser } from '@users';
import UsersRepository from '../users/users.repository';
import { AppError } from '@errors';

class AuthService {
  async signUp(email: string, password: string, name: string): Promise<void> {
    const conflict = await UsersRepository.findByEmail(email);

    if (conflict) {
      throw new AppError('Email taken', 422);
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await UsersRepository.create(email, hashedPassword, name);
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await UsersRepository.findByEmail(email);
    const authError = new AppError('Authentification failed. Check your email/password.', 401);

    if (!user) {
      throw authError;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw authError;
    }

    return user;
  }
}

export const authService = new AuthService();
