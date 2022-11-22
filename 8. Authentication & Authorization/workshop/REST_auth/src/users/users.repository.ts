import { User } from './user.entity';

const users = [new User('test@test.com', '$2b$12$7HftjaznSTN5xcjUr9Gn9u3/NMo2HhWuUdHxPrUd9dZxREI8ckm3a', 'Dummy User')];

export class UsersRepository {
  static async create(email: string, password: string, name: string): Promise<User> {
    const user = new User(email, password, name);
    users.push(user);
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return users.find((user) => user.email === email) ?? null;
  }

  static async findById(id: number): Promise<User | null> {
    return users.find((user) => user.id === id) ?? null;
  }
}
