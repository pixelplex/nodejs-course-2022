import { NextFunction, Request, Response } from 'express';
import { AppError } from '@errors';

import { PostsService } from './posts.service';
import { AddPostRequest, DeletePostRequest, GetOnePostRequest, SearchPostRequest, UpdatePostRequest } from './types';

export class PostsController {
  static getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const posts = await PostsService.findAll();
      res.status(200).json({ posts, totalItems: posts.length });
    } catch (error) {
      next(error);
    }
  };

  static search = async (req: SearchPostRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filteredPosts = await PostsService.searchBy(req.query.phrase);
      res.status(200).json({ posts: filteredPosts, totalItems: filteredPosts.length });
    } catch (error) {
      next(error);
    }
  };

  static getOnePost = async (req: GetOnePostRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await PostsService.findById(Number(req.params.postId));
      if (!post) {
        throw new AppError("Couldn't find post", 404);
      }
      res.status(200).json({ post });
    } catch (error) {
      next(error);
    }
  };

  static addPost = async (req: AddPostRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        body: { title, content, imageUrl },
      } = req;
      if (req.userId === undefined) throw new Error('User id is required');
      const savedPost = await PostsService.create(title, content, imageUrl, req.userId);
      res.status(201).json({
        message: 'Post has been created',
        post: savedPost,
      });
    } catch (error) {
      next(error);
    }
  };

  static updatePost = async (req: UpdatePostRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.userId === undefined) throw new Error('User id is required');
      const updatedPost = await PostsService.update(Number(req.params.postId), req.userId, req.body);
      if (!updatedPost) {
        throw new AppError("Couldn't find post", 404);
      }
      res.status(200).json({
        message: 'Post has been updated',
        post: updatedPost,
      });
    } catch (error) {
      next(error);
    }
  };

  static deletePost = async (req: DeletePostRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.userId === undefined) throw new Error('User id is required');
      const id = await PostsService.delete(Number(req.params.postId), req.userId);
      if (id === null) {
        throw new AppError("Couldn't find post", 404);
      }
      res.status(200).json({
        message: 'Post has been deleted',
        id,
      });
    } catch (error) {
      next(error);
    }
  };
}
