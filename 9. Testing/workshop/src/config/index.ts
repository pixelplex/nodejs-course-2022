import * as dotenv from 'dotenv';
import { Post } from '@posts';
import { User } from '@users';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('JWT secret not specified');

const DB: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'example_db',
  entities: [Post, User],
  synchronize: true,
};

const DB_TEST: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: 'root',
  database: 'example_test',
  entities: [Post, User],
  synchronize: true,
};

export const config = {
  DEV: {
    PORT: 8080,
    DB,
    JWT_SECRET,
  },
  TEST: {
    PORT: 8080,
    DB: DB_TEST,
    JWT_SECRET,
  },
};
