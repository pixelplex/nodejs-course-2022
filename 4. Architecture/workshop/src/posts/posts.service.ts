import { Post } from './post.entity';
import { PostsRepository } from './posts.repository';

export class PostsService {
  static async create(title: string, content: string, imageUrl: string, userId: number): Promise<Post> {
    return PostsRepository.create(title, content, imageUrl, userId);
  }

  static async findById(id: number): Promise<Post | null> {
    return PostsRepository.findById(id);
  }

  static async findAll(): Promise<Post[]> {
    return PostsRepository.findAll();
  }

  static async searchBy(phrase: string): Promise<Post[]> {
    const posts = await PostsRepository.findAll();
    const filteredPosts = posts.filter(
      (p) => p.content.toLowerCase().includes(phrase) || p.title.toLowerCase().includes(phrase)
    );
    return filteredPosts;
  }

  static async update(postId: number, props: Partial<Post>): Promise<Post | null> {
    return PostsRepository.update(postId, props);
  }

  static async delete(postId: number): Promise<number | null> {
    return PostsRepository.delete(postId);
  }
}
