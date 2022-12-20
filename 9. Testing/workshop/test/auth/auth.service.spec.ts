/* eslint-disable @typescript-eslint/no-empty-function */

import { expect } from 'chai';
import 'mocha';

import { before, describe } from 'mocha';
import { AppError } from '@errors';
import { DataSource } from 'typeorm';
import { User, USER_STATUS } from '@users';
import { connectToDatabase } from '@utils';
import { config } from 'config';
import { authService } from '@auth';

const TEST_EMAIL = 'test@test.com';
const TEST_EMAIL2 = 'test2@test.com';
const TEST_PASSWORD2 = 'strong_password';
const TEST_USERNAME2 = 'original_username';

let connection: DataSource;
let testUser: User;

describe('auth/auth.service.ts', () => {
  before('Connect to DB', async () => {
    connection = await connectToDatabase(config.TEST.DB);
    testUser = User.create({
      email: TEST_EMAIL,
      name: 'dummy-user',
      password: 'some_secret_password',
      status: USER_STATUS.ACTIVE,
    });
    await testUser.save();
  });

  after('Disconnect from DB', async () => {
    await testUser.remove();
    await connection.destroy();
  });

  describe('AuthService.signUp()', () => {
    it('Throws an error if email is already taken', async () => {
      try {
        await authService.signUp(TEST_EMAIL, 'password', 'original_name');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError, 'Email taken');
      }
    });

    it('Saves new user successfully', async () => {
      const user = await authService.signUp(TEST_EMAIL2, TEST_PASSWORD2, TEST_USERNAME2);
      await user.remove();
    });
  });

  describe('AuthService.login()', () => {
    it('Logins new user successfully', async () => {
      const user = await authService.signUp(TEST_EMAIL2, TEST_PASSWORD2, TEST_USERNAME2);
      const { token } = await authService.login(TEST_EMAIL2, TEST_PASSWORD2);
      expect(token).to.be.a('string');
      await user.remove();
    });

    it("Throws an error if user doesn't exist", async () => {
      try {
        await authService.login(TEST_EMAIL2, TEST_PASSWORD2);
      } catch (error) {
        expect(error).to.be.instanceOf(AppError, 'Authentication failed. Check your email/password.');
      }
    });

    it('Throws an error if password is wrong', async () => {
      const user = await authService.signUp(TEST_EMAIL2, TEST_PASSWORD2, TEST_USERNAME2);
      try {
        await authService.login(TEST_EMAIL2, 'wrongPassword');
      } catch (error) {
        expect(error).to.be.instanceOf(AppError, 'Authentication failed. Check your email/password.');
      }
      await user.remove();
    });
  });
});
