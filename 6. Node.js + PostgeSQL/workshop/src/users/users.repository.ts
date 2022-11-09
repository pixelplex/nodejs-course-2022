import { User } from './user.entity';
import { USER_STATUS } from './users.constants';

class UsersRepository {
  async create(email: string, password: string, name: string): Promise<User> {
    let user = User.create({
      email,
      namee: name,
      password,
      status: USER_STATUS.ACTIVE,
    });
    user = await User.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return User.findOneBy({ id });
  }
}

export default new UsersRepository();
