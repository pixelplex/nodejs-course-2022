import { User } from '../models/user.model';
import { USER_STATUS } from './user.constants';
import { IUser } from './user.interface';

class UsersRepository {
  async create(email: string, password: string, name: string): Promise<any> {
    const user = await User.create({
      email,
      name,
      password,
      status: USER_STATUS.ACTIVE,
    });
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findById(id: number): Promise<IUser | null> {
    return User.findOne({ id });
  }
}

export default new UsersRepository();
