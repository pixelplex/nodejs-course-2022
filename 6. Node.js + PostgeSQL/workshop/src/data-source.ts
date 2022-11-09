import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import * as Migrations from './migrations';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'example_db',
  synchronize: true,
  // synchronize: false,
  logging: true,
  entities: [User, Post],
  migrations: Object.values(Migrations),
  migrationsTableName: 'custom_migration_table',
});
