import { Post } from 'posts/post.entity';

export type AddPostBody = {
  title: string;
  content: string;
  imageUrl: string;
};

export type UpdatePostBody = Partial<Post>;
