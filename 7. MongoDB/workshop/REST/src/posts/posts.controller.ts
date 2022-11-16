import { NextFunction, Request, Response } from 'express';
import { AppError } from '@errors';

import { PostsService } from './posts.service';
import { ObjectId } from 'mongoose';

export class PostsController {
  static getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const posts = await PostsService.findAll();
      res.status(200).json({ posts, totalItems: posts.length });
    } catch (error) {
      next(error);
    }
  };

  static search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filteredPosts = await PostsService.searchBy(req.query.phrase as string);
      res.status(200).json({ posts: filteredPosts, totalItems: filteredPosts.length });
    } catch (error) {
      next(error);
    }
  };

  static getOnePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await PostsService.findById(req.params.postId as unknown as ObjectId);
      if (!post) {
        throw new AppError("Couldn't find post", 404);
      }
      res.status(200).json({ post });
    } catch (error) {
      next(error);
    }
  };

  static addPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        body: { title, content, imageUrl, userId },
      } = req;
      const savedPost = await PostsService.create(title, content, imageUrl, userId);
      res.status(201).json({
        message: 'The post created',
        post: savedPost,
      });
    } catch (error) {
      next(error);
    }
  };

  static updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedPost = await PostsService.update(req.params.postId as unknown as ObjectId, req.body);
      if (!updatedPost) {
        throw new AppError("Couldn't find post", 404);
      }
      res.status(200).json({
        message: 'The post has been updated.',
        post: updatedPost,
      });
    } catch (error) {
      next(error);
    }
  };

  static deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = await PostsService.delete(req.params.postId as unknown as ObjectId);
      if (id === null) {
        throw new AppError("Couldn't find post", 404);
      }
      res.status(200).json({
        message: 'The post has been deleted.',
        id,
      });
    } catch (error) {
      next(error);
    }
  };
}
