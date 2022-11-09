import * as express from 'express';
import { Application } from 'express';

import { PostsController } from './posts.controller';
import { PostValidation } from './posts.validation';
import { validatePayload } from '@middleware';

const router = express.Router();

router.get('/all', PostsController.getAllPosts);
router.get('/search', ...PostValidation.search, validatePayload, PostsController.search);
router.get('/:postId', ...PostValidation.getOnePost, validatePayload, PostsController.getOnePost);
router.post('/', ...PostValidation.addPost, validatePayload, PostsController.addPost);
router.patch('/:postId', ...PostValidation.updatePost, validatePayload, PostsController.updatePost);
router.delete('/:postId', ...PostValidation.deletePost, validatePayload, PostsController.deletePost);

export function mountRouter(app: Application): void {
  app.use('/post', router);
}
