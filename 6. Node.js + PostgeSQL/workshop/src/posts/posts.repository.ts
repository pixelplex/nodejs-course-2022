import { Post } from './post.entity';
import { ILike } from 'typeorm';

class PostsRepository {
  async create(title: string, content: string, imageUrl: string, creatorId: number): Promise<Post> {
    let post = Post.create({
      title,
      content,
      imageUrl,
      creatorId,
    });
    post = await Post.save(post);
    return post;
  }

  async update(id: number, props: Partial<Post> = {}): Promise<Post | null> {
    const currentPost = await this.findById(id);
    if (!currentPost) {
      return null;
    }
    await Post.update({ id }, { ...currentPost, ...props });
    return this.findById(id);
  }

  async delete(id: number): Promise<void | null> {
    const deletablePost = await this.findById(id);
    if (!deletablePost) {
      return null;
    }
    await Post.delete({ id });
  }

  async findById(id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  async findAllPostsOfUser(userId: number): Promise<Post[]> {
    return Post.findBy({ creatorId: userId });
  }

  async findAll(): Promise<Post[]> {
    // return Post.createQueryBuilder('p')
    // .innerJoinAndSelect('p.creator', 'creator')
    // .getMany();
    return Post.find();
  }

  async search(phrase: string): Promise<Post[]> {
    return Post.find({ where: [{ content: ILike(`%${phrase}%`) }, { title: ILike(`%${phrase}%`) }] });
  }

  async countAll(): Promise<number> {
    return Post.count();
  }
}
export default new PostsRepository();
