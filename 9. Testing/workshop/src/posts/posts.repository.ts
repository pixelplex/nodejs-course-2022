import { Post } from './post.entity';

export class PostsRepository {
  static async create(title: string, content: string, imageUrl: string, creatorId: number): Promise<Post> {
    let post = Post.create({
      title,
      content,
      imageUrl,
      creatorId,
    });
    post = await Post.save(post);
    return post;
  }

  static async update(id: number, props: Partial<Post> = {}): Promise<Post | null> {
    const currentPost = await this.findById(id);
    if (!currentPost) {
      return null;
    }
    await Post.update({ id }, { ...currentPost, ...props });
    return this.findById(id);
  }

  static async delete(id: number): Promise<number | null> {
    const deletablePost = await this.findById(id);
    if (!deletablePost) {
      return null;
    }
    await Post.delete({ id });
    return id;
  }

  static async findById(id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  static async findAllPostsOfUser(userId: number): Promise<Post[]> {
    return Post.findBy({ creatorId: userId });
  }

  static async findAll(): Promise<Post[]> {
    return Post.find();
  }

  static async countAll(): Promise<number> {
    return Post.count();
  }
}
