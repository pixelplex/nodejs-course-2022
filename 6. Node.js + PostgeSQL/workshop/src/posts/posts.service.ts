import { Post } from './post.entity';
import postsRepository from './posts.repository';
// import { AppDataSource } from '../data-source';

export class PostsService {
  static async create(title: string, content: string, imageUrl: string, userId: number): Promise<Post> {
    // await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
    //     await transactionalEntityManager.query(`INSERT INTO "user" ("name", "password", "email", "status") VALUES ('A', '123', 'B', 'active')`);
    //     await transactionalEntityManager.query(`INSERT INTO "post" ("name", "password", "email") VALUES ('A', '123', 'B')`);
    //     // ...
    // })

    return postsRepository.create(title, content, imageUrl, userId);
  }

  static async findById(id: number): Promise<Post | null> {
    return postsRepository.findById(id);
  }

  static async findAll(): Promise<Post[]> {
    return postsRepository.findAll();
  }

  static async searchBy(phrase: string): Promise<Post[]> {
    // TODO: fix
    const posts = await postsRepository.findAll();
    const filteredPosts = posts.filter(
      (p) => p.content.toLowerCase().includes(phrase) || p.title.toLowerCase().includes(phrase)
    );
    return filteredPosts;
    // const posts = await postsRepository.search(phrase);
    // return posts;
  }

  static async update(postId: number, props: Partial<Post>): Promise<Post | null> {
    return postsRepository.update(postId, props);
  }

  static async delete(postId: number): Promise<void | null> {
    return postsRepository.delete(postId);
  }
}
