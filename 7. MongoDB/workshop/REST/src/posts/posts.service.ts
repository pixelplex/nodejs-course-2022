import { IPost } from './post.interface';
import postsRepository from './posts.repository';
import { ObjectId } from 'mongoose';
// import { AppDataSource } from '../data-source';

export class PostsService {
  static async create(title: string, content: string, imageUrl: string, userId: ObjectId): Promise<IPost> {
    // await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
    //     await transactionalEntityManager.query(`INSERT INTO "user" ("name", "password", "email", "status") VALUES ('A', '123', 'B', 'active')`);
    //     await transactionalEntityManager.query(`INSERT INTO "post" ("name", "password", "email") VALUES ('A', '123', 'B')`);
    //     // ...
    // })

    return postsRepository.create(title, content, imageUrl, userId);
  }

  static async findById(id: ObjectId): Promise<IPost | null> {
    return postsRepository.findById(id);
  }

  static async findAll(): Promise<IPost[]> {
    return postsRepository.findAll();
  }

  static async searchBy(phrase: string): Promise<IPost[]> {
    // TODO: fix
    const posts = await postsRepository.findAll();
    const filteredPosts = posts.filter(
      (p) => p.content.toLowerCase().includes(phrase) || p.title.toLowerCase().includes(phrase)
    );
    return filteredPosts;
    // const posts = await postsRepository.search(phrase);
    // return posts;
  }

  static async update(postId: ObjectId, props: Partial<IPost>): Promise<IPost | null> {
    return postsRepository.update(postId, props);
  }

  static async delete(postId: ObjectId): Promise<void | null> {
    return postsRepository.delete(postId);
  }
}
