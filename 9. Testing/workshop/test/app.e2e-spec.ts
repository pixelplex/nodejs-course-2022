import { connectToDatabase } from '@utils';
import { config } from 'config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { app } from '../src/app';

const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'strong_password';
const TEST_USERNAME = 'original_username';

const TEST_EMAIL2 = 'test2@test.com';
const TEST_PASSWORD2 = 'stronger_password';
const TEST_USERNAME2 = 'more_original_username';

let connection: DataSource;
let authToken1: string;
let authToken2: string;
let postId: number;

describe('app.ts', () => {
  beforeAll(async () => {
    connection = await connectToDatabase(config.TEST.DB);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  describe('POST auth/signup', () => {
    test('Create user with new address', async () => {
      const res = await request(app).post('/auth/signup').send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_USERNAME,
      });

      expect(res.body).toEqual({ message: 'User has been created' });
    });

    test('Fails to create user with existing address', async () => {
      const res = await request(app).post('/auth/signup').send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_USERNAME,
      });

      expect(res.body).toEqual({
        message: 'Email taken',
        statusCode: 422,
      });
    });

    test('Create another user successfully', async () => {
      const res = await request(app).post('/auth/signup').send({
        email: TEST_EMAIL2,
        password: TEST_PASSWORD2,
        name: TEST_USERNAME2,
      });

      expect(res.body).toEqual({ message: 'User has been created' });
    });
  });

  describe('POST auth/login', () => {
    test('Fails to authenticate with wrong email', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'em@ilis.wrong',
        password: TEST_PASSWORD2,
      });

      expect(res.body).toEqual({ message: 'Authentication failed. Check your email/password.', statusCode: 401 });
    });

    test('Fails to authenticate with wrong password', async () => {
      const res = await request(app).post('/auth/login').send({
        email: TEST_EMAIL2,
        password: 'wrong_password',
        name: TEST_USERNAME2,
      });

      expect(res.body).toEqual({ message: 'Authentication failed. Check your email/password.', statusCode: 401 });
    });

    test('Sends back token for existing user', async () => {
      const res = await request(app).post('/auth/login').send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_USERNAME,
      });

      expect(res.body).toHaveProperty('token');

      authToken1 = res.body.token;

      const res2 = await request(app).post('/auth/login').send({
        email: TEST_EMAIL2,
        password: TEST_PASSWORD2,
        name: TEST_USERNAME2,
      });

      expect(res2.body).toHaveProperty('token');

      authToken2 = res2.body.token;
    });
  });

  describe('POST /post', () => {
    test('Fails if no "Authorization" header applied', async () => {
      const res = await request(app).post('/post').send({});

      expect(res.body).toEqual({
        message: 'Authorization header is missing',
        statusCode: 400,
      });
    });

    test('Fails if body is incomplete', async () => {
      const res = await request(app).post('/post').set('Authorization', `Bearer ${authToken1}`).send({
        title: ' One more post',
        content: 'Everything works perfectly!',
      });

      expect(res.body).toEqual({
        message: 'Bad request',
        statusCode: 400,
        errors: [
          {
            msg: 'Invalid value',
            param: 'imageUrl',
            location: 'body',
          },
        ],
      });
    });

    test('Creates new post if body is valid', async () => {
      const res = await request(app).post('/post').set('Authorization', `Bearer ${authToken1}`).send({
        title: ' One more post',
        content: 'Everything works perfectly!',
        imageUrl: 'https://images.stock.com/image/1.png',
      });

      expect(res.body).toMatchObject({
        message: 'Post has been created',
        post: {},
      });

      postId = res.body.post.id;
    });
  });

  describe('PATCH /post/:id', () => {
    test('Fails if no "Authorization" header applied', async () => {
      const res = await request(app).patch(`/post/${postId}`).send({});

      expect(res.body).toEqual({
        message: 'Authorization header is missing',
        statusCode: 400,
      });
    });

    test("Doesn't let rebind the id", async () => {
      const res = await request(app).patch(`/post/${postId}`).set('Authorization', `Bearer ${authToken1}`).send({
        id: 5,
      });

      expect(res.body).toEqual({
        message: 'Bad request',
        statusCode: 400,
        errors: [
          {
            value: 5,
            msg: "You can't rebind id",
            param: 'id',
            location: 'body',
          },
        ],
      });
    });

    test('Updates post successfully', async () => {
      const res = await request(app).patch(`/post/${postId}`).set('Authorization', `Bearer ${authToken1}`).send({
        title: 'Updated post',
        content: 'Post updating works awesome!!!',
      });

      expect(res.body).toMatchObject({
        message: 'Post has been updated',
        post: {
          title: 'Updated post',
          content: 'Post updating works awesome!!!',
        },
      });
    });

    test('Refuses to update post of other user', async () => {
      const res = await request(app).patch(`/post/${postId}`).set('Authorization', `Bearer ${authToken2}`).send({
        title: 'Updated post',
        content: 'Post updating works awesome!!!',
      });

      expect(res.body).toEqual({
        message: "Post's creator mismatch",
        statusCode: 403,
      });
    });
  });

  describe('GET /post/:id', () => {
    test('Fails if no "Authorization" header applied', async () => {
      const res = await request(app).get('/post/all');

      expect(res.body).toEqual({
        message: 'Authorization header is missing',
        statusCode: 400,
      });
    });

    test('Fails if id is invalid', async () => {
      const res = await request(app).get('/post/34').set('Authorization', `Bearer ${authToken1}`);

      expect(res.body).toEqual({ message: "Couldn't find post", statusCode: 404 });
    });

    test('Returns post if id is valid', async () => {
      const res = await request(app).get(`/post/${postId}`).set('Authorization', `Bearer ${authToken1}`);

      expect(res.body).toMatchObject({
        post: {},
      });
    });
  });

  describe('DELETE /post/:id', () => {
    test('Fails if no "Authorization" header applied', async () => {
      const res = await request(app).delete(`/post/${postId}`);

      expect(res.body).toEqual({
        message: 'Authorization header is missing',
        statusCode: 400,
      });
    });

    test('Refuses to delete post of other user', async () => {
      const res = await request(app).delete(`/post/${postId}`).set('Authorization', `Bearer ${authToken2}`);

      expect(res.body).toEqual({
        message: "Post's creator mismatch",
        statusCode: 403,
      });
    });

    test('Deletes post successfully', async () => {
      const res = await request(app).delete(`/post/${postId}`).set('Authorization', `Bearer ${authToken1}`);

      expect(res.body).toMatchObject({
        message: 'Post has been deleted',
        id: postId,
      });
    });
  });

  describe('GET /post/all', () => {
    test('Fails if no "Authorization" header applied', async () => {
      const res = await request(app).get('/post/all');

      expect(res.body).toEqual({
        message: 'Authorization header is missing',
        statusCode: 400,
      });
    });

    test('Sends empty array when no posts found', async () => {
      const res = await request(app).get('/post/all').set('Authorization', `Bearer ${authToken1}`);

      expect(res.body).toEqual({ posts: [], totalItems: 0 });
    });
  });
});
