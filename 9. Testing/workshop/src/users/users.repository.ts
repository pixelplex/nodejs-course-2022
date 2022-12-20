import { User } from './user.entity';
import { USER_STATUS } from './user.constants';

export class UsersRepository {
  static async create(email: string, password: string, name: string): Promise<User> {
    let user = User.create({
      email,
      name,
      password,
      status: USER_STATUS.ACTIVE,
    });
    user = await User.save(user);
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return User.findOneBy({ email });
  }

  static async findById(id: number): Promise<User | null> {
    return User.findOneBy({ id });
  }
}
