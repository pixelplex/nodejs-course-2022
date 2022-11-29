import { Post } from '../models/post.model';
import { ObjectId } from 'mongoose';
import { IPost } from './post.interface';

class PostsRepository {
  async create(title: string, content: string, imageUrl: string, creator: ObjectId): Promise<any> {
    const post = await Post.create({
      title, content, imageUrl, creator,
    });
    return post;
  }

  async update(id: ObjectId, props = {}): Promise<IPost | null> {
    const currentPost = await this.findById(id);
    if (!currentPost) {
      return null;
    }
    await Post.updateOne({ id }, { ...currentPost, ...props });
    return this.findById(id);
  }

  async delete(id: ObjectId): Promise<void | null> {
    const deletablePost = await this.findById(id);
    if (!deletablePost) {
      return null;
    }
    await Post.deleteOne({ id });
  }

  async findById(id: ObjectId): Promise<IPost | null> {
    return Post.findOne({ id });
  }

  async findAllPostsOfUser(userId: ObjectId): Promise<IPost[]> {
    return Post.find({ creator: userId });
  }

  async search(phrase: string): Promise<IPost[]> {
    return Post.find({
      $or: [
        { title: { $regex: phrase } },
        { content: { $regex: phrase } },
      ] });
  }

  async findAll(): Promise<IPost[]> {
    return Post.find();
  }

  async countAll() {
    return Post.count();
  }
}

export default new PostsRepository();
