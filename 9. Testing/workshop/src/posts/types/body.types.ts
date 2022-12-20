import { Post } from '../post.entity';

export type AddPostBody = {
  title: string;
  content: string;
  imageUrl: string;
};

export type UpdatePostBody = Partial<Post>;
