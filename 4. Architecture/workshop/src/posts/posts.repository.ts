import { Post } from './post.entity';

let posts: Post[] = [new Post('First post', 'Everything works perfectly!', 'https://images.stock.com/image/1.png', 0)];

export class PostsRepository {
  static async create(title: string, content: string, imageUrl: string, creator: number): Promise<Post> {
    const post = new Post(title, content, imageUrl, creator);
    posts.push(post);
    return post;
  }

  static async update(id: number, props: Partial<Post>): Promise<Post | null> {
    const currentPost = await this.findById(id);
    if (!currentPost) {
      return null;
    }
    const updatedPost = { ...currentPost, ...props };
    posts = posts.filter((post) => post.id !== id);
    posts.push(updatedPost);
    return updatedPost;
  }

  static async delete(id: number): Promise<number | null> {
    const deletablePost = await this.findById(id);
    if (!deletablePost) {
      return null;
    }
    posts = posts.filter((post) => post.id !== id);
    return deletablePost.id;
  }

  static async findById(id: number): Promise<Post | null> {
    return posts.find((post) => post.id === id) ?? null;
  }

  static async findAllPostsOfUser(userId: number): Promise<Post[]> {
    return posts.filter((post) => post.creator === userId);
  }

  static async findAll(): Promise<Post[]> {
    return posts;
  }

  static async countAll(): Promise<number> {
    return posts.length;
  }
}
